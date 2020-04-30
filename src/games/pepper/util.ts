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
    REQ_PLAYERS,
    REQ_CARDS_PER_SUIT,
} from './config';
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
    return plays.slice(trickStartingIndex, plays.length-1);
};