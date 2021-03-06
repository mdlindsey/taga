import {
    GameModel,
    RoundModel,
    ActionInput,
    ActionState,
    RoundData,
    ScoreModel,
} from './@types';
import {
    cardMap,
    MOD_NA,
    MAX_BID,
    MIN_BID,
    PLAYER_NA,
    ACTION_BID,
    ACTION_TRUMP,
    ACTION_SWAP,
    ACTION_PLAY,
    ACTION_DEAL,
    SWAP_REFUSE,
    REQ_PLAYERS,
    REQ_CARDS_PER_SUIT,
    REQ_CARDS_PER_PLAYER,
} from './config';
import {
    deal,
    cardSuit,
    canFollowSuit,
    activeTrick,
    totalActivePlayers,
    trickTakers,
    cardOwner,
} from './util';
export class GameInstance implements GameModel {
    public data:RoundData[];
    public state:ActionState;
    public score:ScoreModel;
    public rounds:RoundModel[];
    constructor(rounds:RoundData[]) {
        this.data = rounds;
        this.denormalize();
    }
    get round():RoundModel {
        return this.rounds[this.rounds.length-1];
    }
    denormalize() {
        this.denormalizeRounds();
        this.reduceExpectedState();
        this.reduceAdjustedScore();
    }
    interact(action:ActionInput):GameModel {
        if (action.id !== this.state.id) {
            throw new Error(`unexpected action[${action.id}]; expecting action[${this.state.id}]`);
        }
        if (action.id === ACTION_DEAL) {
            this.data = [...this.data, { actions: [], hands: deal() }];
            this.denormalize();
            return this;
        }
        if (action.player !== this.state.player) {
            throw new Error(`unexpected player[${action.player}]; expecting player[${this.state.player}]`);
        }
        if (action.id === ACTION_BID) {
            // validate bid
            if (action.payload > MAX_BID) {
                throw new Error(`bid (${action.payload}) exceeds max (${MAX_BID})`);
            }
        }
        if (action.id === ACTION_TRUMP) {
            // Ensure -1 <= trump =< 3
            if (action.payload < -1 || action.payload > 3) {
                throw new Error(`invalid trump suit (${action.payload}); expecting range -1:3`);
            }
        }
        if (action.id === ACTION_SWAP) {
            // validate a swap
            if (this.round.swaps.length) { // partner swapping
                // ensure the partner isn't refusing
                if (action.payload === SWAP_REFUSE) {
                    throw new Error('partner cannot refuse to swap');
                }
            }
        }
        if (action.id === ACTION_PLAY || (action.id === ACTION_SWAP && action.payload !== SWAP_REFUSE)) {
            // ensure they own the card they're swapping
            if (!this.round.hands[action.player].includes(action.payload)) {
                throw new Error(`invalid card ${cardMap[action.payload]}(${action.payload}); must play from hand`);
            }
            // ensure they're following suit if applicable
            const inputSuit = cardSuit(action.payload, this.round.trump);
            const mustFollowSuit = canFollowSuit(this.state.modifier, this.round.hands[action.player], this.round.plays, this.round.trump);
            if (inputSuit !== this.state.modifier && mustFollowSuit) {
                throw new Error(`must follow suit (${this.state.modifier})`);
            }
            // ensure card isn't already played
            if (this.round.plays.includes(action.payload)) {
                throw new Error('invalid card; already played');
            }
        }
        // If no errors were thrown try applying the changes and comparing state to prev
        const oldState = {...this.state};
        this.data[this.data.length-1].actions.push({ id: action.id, payload: action.payload });
        // normalize and reduce state again
        this.denormalize();
        if (oldState.id === this.state.id && oldState.player === this.state.player && oldState.modifier === this.state.modifier) {
            throw new Error('stale state; please report');
        }
        // If everything looks good return the updated game state
        return this;
    }
    denormalizeRounds() {
        this.rounds = [];
        if (!this.data.length) {
            this.rounds[0] = {
                bids: [],
                trump: -2,
                swaps: [],
                plays: [],
                hands: [],
            };
            return;
        }
        for(const roundIndex in this.data) {
            const round = this.data[roundIndex];
            // Separate actions into bids, trump, swaps, and plays 
            let trump = -2; // -2: unset, -1: no trump, 0-3: suit index trump
            const bids:number[] = [], swaps:number[] = [], plays:number[] = [];
            for(const action of round.actions) {
                switch(action.id) {
                    case ACTION_BID:
                        bids.push(action.payload);
                        break;
                    case ACTION_TRUMP:
                        trump = action.payload;
                        break;
                    case ACTION_SWAP:
                        swaps.push(action.payload);
                        break;
                    case ACTION_PLAY:
                        plays.push(action.payload);
                        break;
                }
            }
            // Determine if we need to swap any cards in anyone's hand from a pepper swap
            const hands = round.hands;
            if (swaps.length === 2) {
                for(const handIndex in hands) {
                    for(const cardIndex in hands[handIndex]) {
                        if (hands[handIndex][cardIndex] === swaps[0])
                            hands[handIndex][cardIndex] = swaps[1];
                        if (hands[handIndex][cardIndex] === swaps[1])
                            hands[handIndex][cardIndex] = swaps[0];
                    }
                }
            }
            this.rounds[roundIndex] = {
                bids,
                trump,
                swaps,
                plays,
                hands,
            };
        }
    }
    reduceExpectedState() {
        // Determine if a player is sitting out due to a partner peppering
        const highestBid = Math.max(...this.round.bids);
        const playerCount = totalActivePlayers(this.round.bids);
        if (!this.round.hands.length || [].concat.apply([], this.round.hands).length < REQ_PLAYERS * REQ_CARDS_PER_PLAYER) {
            this.state = { id: ACTION_DEAL, player: PLAYER_NA, modifier: MOD_NA };
            return;
        }
        if (this.round.bids.length >= REQ_PLAYERS && Math.max(...this.round.bids) < MIN_BID) {
            // Everyone passed, redeal and start new round
            this.state = { id: ACTION_DEAL, player: PLAYER_NA, modifier: MOD_NA };
            return;
        }
        if (this.round.plays.length === playerCount * REQ_CARDS_PER_PLAYER) {
            // All cards are played, start a new round
            this.state = { id: ACTION_DEAL, player: PLAYER_NA, modifier: MOD_NA };
            return;
        }
        const firstBidderIndex = (this.data.length - 1) % REQ_PLAYERS;
        if (!this.round.bids.length) {
            // It's the first player's turn to bid
            this.state = { id: ACTION_BID, player: firstBidderIndex, modifier: MOD_NA };
            return;
        }
        const highestBidderIndex = (firstBidderIndex + this.round.bids.indexOf(highestBid)) % REQ_PLAYERS;
        if (this.round.trump === -2) {
            if (playerCount !== REQ_PLAYERS || this.round.bids.length >= REQ_PLAYERS) {
                // Someone has peppered or everyone has bid, it's the highest bidder's turn to choose trump
                this.state = { id: ACTION_TRUMP, player: highestBidderIndex, modifier: MOD_NA };
                return;
            }
            // Otherwise it's the next player's turn to bid
            const nextBidderIndex = (firstBidderIndex + this.round.bids.length) % REQ_PLAYERS;
            this.state = { id: ACTION_BID, player: nextBidderIndex, modifier: highestBid };
            return;
        }
        // Determine if we need to swap
        const highestBidderPartnerIndex = (highestBidderIndex + 2) % REQ_PLAYERS;
        if (highestBid === MAX_BID && this.round.swaps.length < 2 && this.round.swaps[0] !== -1) {
            // We have a pepper bid with outstanding swaps (less than 2 and not rejected)
            if (!this.round.swaps.length) { // No swaps yet, offer to highest bidder
                this.state = { id: ACTION_SWAP, player: highestBidderIndex, modifier: MOD_NA };
                return;
            }
            const desiredSuit = this.round.trump < 0 ? MOD_NA : Math.floor(this.round.swaps[0] / REQ_CARDS_PER_SUIT);
            this.state = { id: ACTION_SWAP, player: highestBidderPartnerIndex, modifier: desiredSuit };
            return;
        }
        if (!this.round.plays.length) {
            // highest bidder's turn to play any suit
            this.state = { id: ACTION_PLAY, player: highestBidderIndex, modifier: MOD_NA };
            return;
        }
        if (this.round.plays.length % playerCount > 0) {
            // next player's turn to follow suit (if applicable)
            const trick = activeTrick(this.round.bids, this.round.plays);
            let nextPlayerIndex = ( cardOwner(trick[trick.length-1], this.round.hands) + 1 ) % playerCount;
            if (highestBid === MAX_BID && nextPlayerIndex === highestBidderPartnerIndex) {
                nextPlayerIndex++;
            }
            this.state = { id: ACTION_PLAY, player: nextPlayerIndex, modifier: cardSuit(trick[0], this.round.trump) };
            return;
        }
        // Trick taker's turn to play any suit
        const takers = trickTakers(this.round.bids, this.round.hands, this.round.plays, this.round.trump);
        this.state = { id: ACTION_PLAY, player: takers[takers.length-1], modifier: MOD_NA };
    }
    reduceAdjustedScore() {
        this.score = {
            tricks: [
                0, // Player #1
                0, // Player #2
                0, // Player #3
                0, // Player #4
            ],
            combined: [
                0, // Player #1 + Player #3
                0, // Player #2 + Player #4
            ]
        };
        if (!this.data.length) {
            return;
        }
        for(const roundIndex in this.rounds) {
            const round = this.rounds[roundIndex];
            if (round.plays.length < totalActivePlayers(round.bids)) {
                continue;
            }
            // Get tricks taken per player
            const tricksTaken = [0, 0, 0, 0];
            trickTakers(round.bids, round.hands, round.plays, round.trump)
                .forEach(player => { tricksTaken[player]++; this.score.tricks[player]++; });
            if (round.plays.length < REQ_CARDS_PER_PLAYER * totalActivePlayers(round.bids)) {
                continue;
            }
            // See if bid requirement was met
            const highestBid = Math.max(...round.bids);
            const firstBidderIndex = Number(roundIndex) % REQ_PLAYERS;
            const highestBidderIndex = firstBidderIndex + round.bids.indexOf(highestBid);
            const highestBidderPartnerIndex = (highestBidderIndex + 2) % REQ_PLAYERS;
            const combinedTricks = tricksTaken[highestBidderIndex] + tricksTaken[highestBidderPartnerIndex];
            const highestBiddingTeamIndex = !highestBidderIndex || highestBidderIndex === 2 ? 0 : 1;
            // Failure to meet bid is penalty of bid (pepper x2)
            const weightedAmount = highestBid === MAX_BID ? highestBid * 2 : combinedTricks;
            if (combinedTricks < highestBid) {
                this.score.combined[highestBiddingTeamIndex] -= weightedAmount;
            } else {
                this.score.combined[highestBiddingTeamIndex] += weightedAmount;
            }
            const otherTeamIndex = highestBiddingTeamIndex ? 0 : 1;
            this.score.combined[otherTeamIndex] += tricksTaken.reduce((a,b) => a+b, 0) - combinedTricks;
        }
    }
}
