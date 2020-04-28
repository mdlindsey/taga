import {
    GameModel,
    RoundModel,
    ActionInput,
    ActionState,
    RoundData,
    ScoreModel,
} from './@types';
import {
    MAX_BID,
    ACTION_BID,
    ACTION_TRUMP,
    ACTION_SWAP,
    ACTION_PLAY,
    ACTION_DEAL,
    REQ_PLAYERS,
    REQ_CARDS_PER_PLAYER,
    PLAYER_NA,
    MOD_NA,
    REQ_CARDS_PER_SUIT,
} from './config';
export class GameInstance implements GameModel {
    public data:RoundData[];
    public round:RoundModel;
    public state:ActionState;
    public score:ScoreModel;
    constructor(rounds) {
        this.data = rounds;
        this.normalize();
        this.reduce();
    }
    interact(action: ActionInput) {
        return this;
    }
    normalize() {
        // Separate actions into bids, trump, swaps, and plays 
        let trump = -2; // -2: unset, -1: no trump, 0-3: suit index trump
        const round = this.data[this.data.length - 1];
        const bids:number[] = [], swaps:number[] = [], plays:number[] = [];
        for(const action of round.actions) {
            switch(action.actionId) {
                case ACTION_BID:
                    bids.push(action.actionPayload);
                    break;
                case ACTION_TRUMP:
                    trump = action.actionPayload;
                    break;
                case ACTION_SWAP:
                    swaps.push(action.actionPayload);
                    break;
                case ACTION_PLAY:
                    plays.push(action.actionPayload);
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
    reduce() {
        // Determine if a player is sitting out due to a partner peppering
        const highestBid = Math.max(...this.round.bids);
        const totalActivePlayers = highestBid !== MAX_BID ? REQ_PLAYERS : REQ_PLAYERS - 1;
        if (this.round.plays.length === totalActivePlayers * REQ_CARDS_PER_PLAYER) {
            // All cards are played, start a new round
            this.state = { actionId: ACTION_DEAL, playerIndex: PLAYER_NA, actionModifier: MOD_NA };
            return;
        }
        const firstBidderIndex = (this.data.length - 1) % REQ_PLAYERS;
        if (!this.round.bids.length) {
            // It's the first player's turn to bid
            this.state = { actionId: ACTION_BID, playerIndex: firstBidderIndex, actionModifier: MOD_NA };
            return;
        }
        const highestBidderIndex = firstBidderIndex + this.round.bids.indexOf(highestBid)
        if (this.round.trump === -2) {
            if (totalActivePlayers !== REQ_PLAYERS || this.round.bids.length === REQ_PLAYERS) {
                // Someone has peppered or everyone has bid, it's the highest bidder's turn to choose trump
                this.state = { actionId: ACTION_TRUMP, playerIndex: highestBidderIndex, actionModifier: MOD_NA };
                return;
            }
            // Otherwise it's the next player's turn to bid
            this.state = { actionId: ACTION_BID, playerIndex: firstBidderIndex + this.round.bids.length, actionModifier: highestBid };
            return;
        }
        // Determine if we need to swap
        const highestBidderPartnerIndex = (highestBidderIndex + 2) % REQ_PLAYERS;
        if (highestBid === MAX_BID && this.round.swaps.length < 2 && this.round.swaps[0] !== -1) {
            // We have a pepper bid with outstanding swaps (less than 2 and not rejected)
            if (!this.round.swaps.length) { // No swaps yet, offer to highest bidder
                this.state = { actionId: ACTION_SWAP, playerIndex: highestBidderIndex, actionModifier: MOD_NA };
                return;
            }
            const desiredSuit = this.round.trump < 0 ? MOD_NA : Math.floor(this.round.swaps[0] / REQ_CARDS_PER_SUIT);
            this.state = { actionId: ACTION_SWAP, playerIndex: highestBidderPartnerIndex, actionModifier: desiredSuit };
            return;
        }
        if (!this.round.plays.length) {
            // highest bidder's turn to play any suit
            this.state = { actionId: ACTION_PLAY, playerIndex: highestBidderIndex, actionModifier: MOD_NA };
            return;
        }
        if (this.round.plays.length % totalActivePlayers === 0) {
            // trick taker's turn to play any suit
            this.state = { actionId: ACTION_PLAY, playerIndex: highestBidderIndex, actionModifier: MOD_NA };
            return;
        }


        // Determine where the last trick started
        const trickStartingIndex = plays.length < totalActivePlayers ? 0 : plays.length - (plays.length % totalActivePlayers);
        return;
    }
}