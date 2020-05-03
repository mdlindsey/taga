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
    sortCardsByRank,
    cardSuit,
    canFollowSuit,
    activeTrick,
    prevTrick,
    totalActivePlayers,
    lastTrickTaker,
} from './util';
import { act } from './bot';
export class GameInstance implements GameModel {
    public data:RoundData[];
    public round:RoundModel;
    public state:ActionState;
    public score:ScoreModel;
    constructor(rounds:RoundData[]) {
        this.data = rounds;
        this.normalizeRound();
        this.reduceExpectedState();
    }
    bot():number {
        return act(this);
    }
    interact(action:ActionInput):GameModel {
        if (action.id !== this.state.id) {
            throw new Error(`unexpected action[${action.id}]; expecting action[${this.state.id}]`);
        }
        if (action.player !== this.state.player) {
            throw new Error(`unexpected player[${action.player}]; expecting player[${this.state.player}]`);
        }
        if (action.id === ACTION_BID) {
            // validate bid
            if (action.payload > MAX_BID) {
                throw new Error(`bid (${action.payload}) exceeds max (${MAX_BID})`);
            }
            // Testing without this - if we only take max bids does this matter?
            // const highestBid = Math.max(...this.round.bids);
            // if (action.payload <= highestBid && action.payload >= MIN_BID) {
            //     throw new Error(`must pass (bid 0) or bid more than ${highestBid}`);
            // }
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
        this.normalizeRound();
        this.reduceExpectedState();
        if (oldState.id === this.state.id && oldState.player === this.state.player) {
            throw new Error('stale state; please report');
        }
        // If everything looks good return the updated game state
        return this;
    }
    normalizeRound() {
        const round = this.data[this.data.length - 1];
        if (!round || !round.actions || !round.hands) {
            this.round = {
                bids: [],
                trump: -2,
                swaps: [],
                plays: [],
                hands: [],
            };
            return;
        }
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

        this.round = {
            bids,
            trump,
            swaps,
            plays,
            hands,
        };
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
        const highestBidderIndex = firstBidderIndex + this.round.bids.indexOf(highestBid);
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
            const nextPlayerIndex = ( highestBidderIndex + this.round.plays.length ) % playerCount;
            this.state = { id: ACTION_PLAY, player: nextPlayerIndex, modifier: cardSuit(trick[0], this.round.trump) };
            return;
        }
        // Trick taker's turn to play any suit
        const trickTakerIndex = lastTrickTaker(this.round.bids, this.round.plays, this.round.trump, this.data.length);
        this.state = { id: ACTION_PLAY, player: trickTakerIndex, modifier: MOD_NA };
    }
}
