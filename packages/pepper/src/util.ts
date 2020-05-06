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
    REQ_CARDS_PER_PLAYER,
} from './config';
import { ActionState, ActionInput } from './@types';
export const deal = ():number[][] => {
    const hands:number[][] = [];
    for(let i = 0; i < REQ_PLAYERS; i++) {
        hands[i] = [];
        for(let j = 0; j < REQ_CARDS_PER_PLAYER; j++) {
            let randomCard = -1;
            while(randomCard < 0 || [].concat.apply([], hands).includes(randomCard)) {
                randomCard = Math.floor(Math.random() * Math.floor(REQ_PLAYERS * REQ_CARDS_PER_PLAYER));
            }
            hands[i].push(randomCard);
        }
    }
    return hands;
};
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

export const sortTrick = (cards:number[], trump:number):number[] => {
    const suitToFollow = cardSuit(cards[0], trump);
    return cards.sort((c1, c2) => {
        const s1 = cardSuit(c1, trump);
        const s2 = cardSuit(c2, trump);
        if (s1 === suitToFollow && s2 === suitToFollow) {
            return compareSuitedCards(c1, c2, trump);
        }
        if (s1 === suitToFollow && s2 !== suitToFollow) {
            return -1;
        }
        if (s1 !== suitToFollow && s2 === suitToFollow) {
            return 1;
        }
        // neither are the correct suit so it doesn't matter
        return -1;
    });
};
export const sortSuitedCards = (suitedCars:number[], trump:number):number[] => {
    return suitedCars.sort((c1, c2) => compareSuitedCards(c1, c2, trump));
};
export const compareSuitedCards = (c1:number, c2:number, trump:number):number => {
    const s1 = cardSuit(c1, trump);
    const s2 = cardSuit(c2, trump);
    if (s1 !== s2) {
        throw new Error('encountered unsuited cars in compareSuitedCards');
    }
    // see if its the trump suit
    if (s1 === trump) {
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
    }
    // no other conditions met so it's numerical comparison
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
export const totalActivePlayers = (bids:number[]) => Math.max(...bids) !== MAX_BID ? REQ_PLAYERS : REQ_PLAYERS - 1;
export const activeTrick = (bids:number[], plays:number[]):number[] => {
    const trickStartingIndex = plays.length < totalActivePlayers(bids) ? 0 : plays.length - (plays.length % totalActivePlayers(bids));
    return plays.slice(trickStartingIndex);
};
export const prevTrick = (bids:number[], plays:number[]):number[] => {
    const trickStartingIndex = Math.floor(plays.length / totalActivePlayers(bids)) * totalActivePlayers(bids);
    return plays.slice(trickStartingIndex - totalActivePlayers(bids), trickStartingIndex + totalActivePlayers(bids));
};

export const cardOwner = (card:number, hands:number[][]):number => {
    for(const playerIndex in hands) {
        if (hands[playerIndex].includes(card)) {
            return Number(playerIndex);
        }
    }
    return -1;
};

export const trickTakers = (bids:number[], hands:number[][], plays:number[], trump:number):number[] => {
    // Group plays into tricks
    const tricks:number[][] = [];
    const playerCount = totalActivePlayers(bids);
    for(let i = 0; i < plays.length; i++) {
        const trickIndex = Math.floor(i / playerCount);
        if (!tricks[trickIndex]) {
            tricks[trickIndex] = [];
        }
        tricks[trickIndex].push(plays[i]);
    } // probably have a bug with tricktaker being -1 from no owner
    // Loop through tricks and determine who took each one
    const takers:number[] = [];
    for(let i = 0; i < tricks.length; i++) {
        const rankedTrick = sortTrick(tricks[i], trump);
        takers[i] = cardOwner(rankedTrick[0], hands);
    }
    // Determine who took the last trick
    return takers;
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
            caption = action.payload < 0 ? 'declined swap' : `swapped ${cardMap[action.payload]}`;
            break;
        case ACTION_PLAY:
            caption = `played ${cardMap[action.payload]}`;
            break;
        default:
            caption = `${actionMap[action.id]}s ${action.payload}`;
    }
    return `Player #${action.player+1} ${caption}`;
};

export const sortCardsForHand = (cards:number[], trump:number):number[] => {
    // Group by suit
    const suits:number[][] = [[],[],[],[]];
    for(const card of cards) {
        suits[cardSuit(card, trump)].push(card);
    }
    // Order suits highest to lowest
    for(const suit in suits) {
        suits[suit] = sortSuitedCards(suits[suit], trump);
    }
    return [].concat.apply([], suits.sort((s1:number[], s2:number[]) => s2.length - s1.length));
};
