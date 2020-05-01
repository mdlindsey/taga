import {
    SJ,
    HJ,
    CJ,
    DJ,
    SUIT_S,
    SUIT_H,
    SUIT_C,
    SUIT_D,
    MAX_BID,
    MIN_BID,
    ACTION_BID,
    ACTION_TRUMP,
    ACTION_SWAP,
    ACTION_PLAY,
    REQ_PLAYERS,
    REQ_CARDS_PER_SUIT,
    actionMap,
    suitMap,
    cardMap,
} from './config';
import { ActionState, ActionInput } from './@types';
export const cardSuit = (card:number, trump:number):number => {
    if (isBowerTrump(card,trump)) {
        switch(card) {
            case SJ: return SUIT_C;
            case HJ: return SUIT_D;
            case CJ: return SUIT_S;
            case DJ: return SUIT_H;
        }
    }
    return Math.floor(card / REQ_CARDS_PER_SUIT);
};
export const isHighTrump = (card:number, trump:number):boolean => {
    return (
        (trump === SUIT_S && card === SJ) ||
        (trump === SUIT_H && card === HJ) ||
        (trump === SUIT_C && card === CJ) ||
        (trump === SUIT_D && card === DJ)
    );
};
export const isBowerTrump = (card:number, trump:number):boolean => {
    return (
        (trump === SUIT_S && card === CJ) ||
        (trump === SUIT_H && card === DJ) ||
        (trump === SUIT_C && card === SJ) ||
        (trump === SUIT_D && card === HJ)
    );
};
export const sortCardsByRank = (c1:number, c2:number, trump:number):number => { // pass to Array.sort()
    const suit1 = cardSuit(c1, trump);
    const suit2 = cardSuit(c2, trump);
    if (trump < 0 || (suit1 !== trump && suit2 !== trump)) {
        // no trump just raw value
        if (suit1 !== suit2 || c1 < c2) {
            // didn't follow suit or card1 is higher (numerically lower)
            return -1;
        }
        // if no condition above is true card2 must be higher
        return 1;
    }
    // at this point we know we have at least one trump card
    if (suit1 === trump && suit2 !== trump) {
        return -1;
    }
    if (suit1 !== trump && suit2 === trump) {
        return 1;
    }
    // both cards are trump, determine which is higher
    if (isHighTrump(c1, trump)) {
        return -1;
    }
    if (isHighTrump(c2, trump)) {
        return 1;
    }
    if (isBowerTrump(c1, trump)) {
        return -1;
    }
    if (isBowerTrump(c2, trump)) {
        return 1;
    }
    // both are trump and neither are Jacks so it's numerical comparison
    return c1 < c2 ? -1 : 1;
};
export const canFollowSuit = (suitToFollow:number, hand:number[], plays:number[], trump:number):boolean => {
    for(const card of hand) {
        if (!plays.includes(card) && cardSuit(card, trump) === suitToFollow) {
            return true;
        }
    }
    return false;
};
export const activeTrick = (bids:number[], plays:number[]):number[] => {
    const totalActivePlayers = Math.max(...bids) !== MAX_BID ? REQ_PLAYERS : REQ_PLAYERS - 1;
    const trickStartingIndex = plays.length < totalActivePlayers ? 0 : plays.length - (plays.length % totalActivePlayers);
    return plays.slice(trickStartingIndex);
};
export const prevTrick = (bids:number[], plays:number[]):number[] => {
    const totalActivePlayers = Math.max(...bids) !== MAX_BID ? REQ_PLAYERS : REQ_PLAYERS - 1;
    const trickStartingIndex = plays.length < totalActivePlayers ? 0 : plays.length - (plays.length % totalActivePlayers);
    return plays.slice(trickStartingIndex - totalActivePlayers, plays.length);
};

export const translateAction = (action:ActionState|ActionInput|any):string => {
    if (action.modifier !== undefined) {
        // Dealing with action state
        return translateActionState(action);
    }
    return translateActionInput(action);
};

const translateActionState = (action:ActionState):string => {
    const verb = action.id === ACTION_TRUMP ? 'choose trump' : actionMap[action.id];
    let modifier = '';
    if (action.id === ACTION_BID) {
        modifier = `at least ${action.modifier < MIN_BID ? MIN_BID : action.modifier}`;
    }
    if (action.id === ACTION_PLAY || action.id === ACTION_SWAP) {
        modifier = action.modifier === -1 ? 'any card' : `a ${suitMap[action.modifier]}`;
    }
    return `Player #${action.player+1} to ${verb} ${modifier}`;
};

const translateActionInput = (action:ActionInput):string => {
    let caption = '';
    switch(action.id) {
        case ACTION_TRUMP:
            caption = `chose ${action.payload < 0 ? 'no' : `${suitMap[action.payload]}s`} trump`;
            break;
        case ACTION_SWAP:
            caption = `swapped ${cardMap[action.payload]}`;
            break;
        case ACTION_PLAY:
            caption = `played ${cardMap[action.payload]}`;
            break;
        default:
            caption = `${actionMap[action.id]}s ${action.payload}`;
    }
    return `Player #${action.player+1} ${caption}`;
};
