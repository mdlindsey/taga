import {
    GameModel,
    RoundModel,
    ActionInput,
    ActionState,
    RoundData,
    ScoreModel,
} from './@types';
import {
    TRUMP_NONE,
    REQ_PLAYERS,
    REQ_CARDS_PER_SUIT,
    REQ_CARDS_PER_PLAYER,
} from './config';
import { activeTrick, cardSuit, sortCardsByRank, canFollowSuit, isHighTrump, isBowerTrump } from './util';

export const act = (game:GameModel):number => {
    return play(game.round.hands[game.state.player], game.round.bids, game.round.plays, game.round.trump);
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
        return sluff(hand, plays, trump);
    }
    // Can we play the highest of the led suit?
    const suitToFollow = cardSuit(trick[0], trump);
    const highestOfSuitInHand = highestOfSuit(suitToFollow, cardsInHand, plays, trump);
    if (highestOfSuitInHand === highestOfSuitUnplayed(suitToFollow, plays, trump)) {
        return highestOfSuitInHand;
    }
    // Can we play trump?
    const canPlayTrump = canFollowSuit(trump, hand, plays, trump);
    const mustFollowSuit = canFollowSuit(suitToFollow, hand, plays, trump);
    if (!canPlayTrump || mustFollowSuit) {
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
    const ourTrump = cardsInHand.sort((c1, c2) => sortCardsByRank(c1, c2, trump)).filter(card => cardSuit(card, trump) === trump);
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
    const groupedBySuit:number[][] = [];
    for(const card of cardsInHand) {
        groupedBySuit[cardSuit(card, trump)].push(card);
    }
    // check which suit has the lowest high card
    let suitWithLowestHigh:number = -1;
    for(const suitStr in groupedBySuit) {
        const suit = Number(suitStr);
        if (!groupedBySuit[suit] || !groupedBySuit[suit].length) {
            continue;
        }
        const bestOfSuit = highestOfSuit(suit, groupedBySuit[suit], plays, trump);
        const lowestHighBest = highestOfSuit(suitWithLowestHigh, groupedBySuit[suitWithLowestHigh], plays, trump);
        if (!suit || cardRankBySuit(bestOfSuit, trump) > cardRankBySuit(lowestHighBest, suitWithLowestHigh)) {
            // if the card rank is greater the card value is worse
            suitWithLowestHigh = suit;
        }
    }
    // play the worst card of the lowest high suit
    return groupedBySuit[suitWithLowestHigh].sort((c1, c2) => sortCardsByRank(c1, c2, trump))[groupedBySuit[suitWithLowestHigh].length - 1];
};

const highestOfSuitUnplayed = (suitToFollow:number, plays:number[], trump:number):number => {
    // loop through all cards and see which ones belong to this suit that have not been played
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
    return unplayedOfSuit.sort((c1, c2) => sortCardsByRank(c1, c2, trump))[0];
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