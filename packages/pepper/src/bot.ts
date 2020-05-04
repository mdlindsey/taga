import {
    GameModel,
} from './@types';
import {
    TRUMP_NONE,
    REQ_PLAYERS,
    REQ_CARDS_PER_SUIT,
    REQ_CARDS_PER_PLAYER,
    ACTION_BID,
    ACTION_TRUMP,
    ACTION_SWAP,
    ACTION_PLAY,
} from './config';
import { activeTrick, cardSuit, sortSuitedCards, canFollowSuit, isHighTrump, isBowerTrump } from './util';

export const act = (game:GameModel):number => {
    const { state, round: { bids, plays, hands, trump, swaps } } = game;
    const hand = hands[state.player];
    switch(game.state.id) {
        default:
        case ACTION_BID:
            return bidWithTrump(hand).bid;
        case ACTION_TRUMP:
            return bidWithTrump(hand).trump;
        case ACTION_SWAP:
            return swap(hand, plays, trump, swaps);
        case ACTION_PLAY:
            return play(hand, bids, plays, trump);
    }
};

export const play = (hand:number[], bids:number[], plays:number[], trump:number):number => {
    const cardsInHand = hand.filter(c => !plays.includes(c));
    const trick = activeTrick(bids, plays);
    if (!trick.length) {
        // see if we have the highest of any suit
        for(const card of cardsInHand) {
            if (card === highestOfSuitUnplayed(cardSuit(card, trump), plays, trump)) {
                return card;
            }
        }
    }
    // Can we play the highest of the led suit?
    const suitToFollow = cardSuit(trick[0], trump);
    const highestOfSuitInHand = highestOfSuit(suitToFollow, cardsInHand, plays, trump);
    const playsWithoutTrick = plays.filter((card:number) => !trick.includes(card));
    if (highestOfSuitInHand >= 0 && highestOfSuitInHand === highestOfSuitUnplayed(suitToFollow, playsWithoutTrick, trump)) {
        return highestOfSuitInHand;
    }
    // Do we have to follow suit?
    const mustFollowSuit = canFollowSuit(suitToFollow, hand, plays, trump);
    if (mustFollowSuit) {
        // Play the lowest of this suit
        const cardsInHandOfSuit = sortSuitedCards(cardsInHand.filter(card => cardSuit(card, trump) === suitToFollow), trump);
        return cardsInHandOfSuit[cardsInHandOfSuit.length - 1];
    }
    // Can we play trump?
    const canPlayTrump = canFollowSuit(trump, hand, plays, trump);
    if (!canPlayTrump) {
        // Can't trump, just sluff
        return sluff(hand, plays, trump);
    }
    // Trump dat ish!
    // Figure out partner's card index based on current turn
    let partnerIndex:number;
    switch(trick.length) {
        case 0: partnerIndex = 2; break;
        case 1: partnerIndex = 3; break;
        case 2: partnerIndex = 0; break;
        case 3: partnerIndex = 1; break;
    }
    const ourTrump = sortSuitedCards(cardsInHand.filter(card => cardSuit(card, trump) === trump), trump);
    const opponentsTrump = trick.filter((card:number, index:number) => index !== partnerIndex && cardSuit(card, trump) === trump);
    if (!opponentsTrump.length) {
        // No trump played, play a low trump and hope it goes through
        return ourTrump[ourTrump.length - 1];
    }
    // See if we can beat the trump they played
    const theirBestTrump = highestOfSuit(trump, opponentsTrump, plays, trump);
    const canOverTrump = ourTrump[0] === highestOfSuit(trump, [ourTrump[0], theirBestTrump], plays, trump);
    if (!canOverTrump) {
        return sluff(hand, plays, trump);
    }
    // Play lowest trump that will get over theirs
    for(let i = ourTrump.length-1; i >= 0; i--) {
        if (highestOfSuit(trump, [ourTrump[i], theirBestTrump], plays, trump) === ourTrump[i]) {
            return ourTrump[i];
        }
    }
    // should never get here but just to prevent TS from complaining, sluff just in case
    return sluff(hand, plays, trump);
};

const sluff = (hand:number[], plays:number[], trump:number):number => {
    const cardsInHand = hand.filter(c => !plays.includes(c));
    if (cardsInHand.length === 1) {
        // only have one card, play it
        return cardsInHand[0];
    }
    // get lowest card of shortest suit with lowest high card
    let suitWithLowestHigh:number = -1;
    const groupedBySuits:number[][] = [];
    for(let suit = 0; suit < 4; suit++) {
        groupedBySuits[suit] = cardsInHand.filter(card => cardSuit(card, trump) === suit);
        if (!groupedBySuits[suit].length) {
            continue;
        }
        const bestOfSuit = highestOfSuit(suit, groupedBySuits[suit], plays, trump);
        const lowestHighBest = highestOfSuit(suitWithLowestHigh, groupedBySuits[suitWithLowestHigh], plays, trump);
        if (suitWithLowestHigh === -1 || cardRankBySuit(bestOfSuit, trump) > cardRankBySuit(lowestHighBest, suitWithLowestHigh)) {
            // if the card rank is greater the card value is worse
            suitWithLowestHigh = suit;
        }
    }
    // play the worst card of the lowest high suit
    const suited = groupedBySuits[suitWithLowestHigh];
    return sortSuitedCards(suited, trump)[suited.length-1];
};

const swap = (hand:number[], plays:number[], trump:number, swaps:number[]):number => {
    if (swaps.length) {
        return sluff(hand, plays, trump);
    }
    return -1;
};

const bidWithTrump = (hand:number[]=[]):{bid:number, trump:number} => {
    let noTrumpBid = 0;
    let maxTrumpBid = 0;
    let maxTrumpSuit = TRUMP_NONE;
    for(let suit = 0; suit < 4; suit++) {
        const cardsOfSuitNoTrump = hand.filter((card:number) => cardSuit(card, TRUMP_NONE) === suit);
        noTrumpBid += noTrumpBidForSuit(cardsOfSuitNoTrump);
        const cardsOfSuitTrump = hand.filter((card:number) => cardSuit(card, suit) === suit);
        const bidTrump = trumpBidForSuit(cardsOfSuitTrump, suit);
        if (bidTrump > maxTrumpBid) {
            maxTrumpBid = bidTrump;
            maxTrumpSuit = suit;
        }
    }
    if (maxTrumpBid > noTrumpBid) {
        return { bid: maxTrumpBid, trump: maxTrumpSuit };
    }
    return { bid: noTrumpBid, trump: TRUMP_NONE };
};

const trumpBidForSuit = (cardsOfSameSuit:number[], trump:number):number => {
    const ranks = cardsOfSameSuit.map(card => cardRankBySuit(card, trump));
    if (ranks.includes(0)) {
        if (ranks.includes(1)) {
            if (ranks.includes(2)) {
                return ranks.length;
            }
            return ranks.length - 1;
        }
        return 1;
    }
    if (ranks.length >= 5 || (ranks.includes(1) && ranks.length >= 4)) {
        return ranks.length - 1;
    }
    return 0;
};

const noTrumpBidForSuit = (cardsOfSameSuit:number[]):number => {
    const ranks = cardsOfSameSuit.map(card => cardRankBySuit(card, TRUMP_NONE));
    if (ranks.includes(0)) {
        if (ranks.includes(1)) {
            return ranks.length;
        }
        return 1;
    }
    return 0;
};

const highestOfSuitUnplayed = (suitToFollow:number, plays:number[], trump:number):number => {
    const deck:number[] = [];
    for(let card = 0; card < REQ_PLAYERS * REQ_CARDS_PER_PLAYER; card++) {
        deck.push(card);
    }
    return highestOfSuit(suitToFollow, deck, plays, trump);
}

const highestOfSuit = (suitToFollow:number, cards:number[], plays:number[], trump:number):number => {
    if (!cards || !cards.length) {
        return -1; // can't process
    }
    const unplayedOfSuit:number[] = [];
    for(const card of cards) {
        if (cardSuit(card, trump) === suitToFollow && !plays.includes(card)) {
            unplayedOfSuit.push(card);
        }
    }
    if (!unplayedOfSuit.length) {
        return -1; // none left of this suit
    }
    return sortSuitedCards(unplayedOfSuit, trump)[0];
};

const cardRankBySuit = (card:number, trump:number):number => {
    const suitId = cardSuit(card, trump);
    const suitStartIndex = suitId * REQ_CARDS_PER_SUIT;
    if (trump === TRUMP_NONE) {
        return card - suitStartIndex;
    }
    if (isHighTrump(card, trump)) {
        return 0;
    }
    if (isBowerTrump(card, trump)) {
        return 1;
    }
    return card - suitStartIndex + 2;
};