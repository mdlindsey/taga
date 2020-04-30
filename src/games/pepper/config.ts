import { FORMERR } from "dns"

// GAME REQUIREMENTS
export const MIN_BID = 3
export const MAX_BID = 6
export const REQ_PLAYERS = 4
export const REQ_CARDS_PER_SUIT = 6
export const REQ_CARDS_PER_PLAYER = 6

// ACTIONS
export const ACTION_BID = 0
export const ACTION_TRUMP = 1
export const ACTION_SWAP = 2
export const ACTION_PLAY = 3
export const ACTION_DEAL = -1

// MODIFIERS
export const MOD_NA = -1
// PLAYERS
export const PLAYER_NA = -1

// SUITS
// Suit order does not matter but cards must go from high to low (eg: A=0,9=5) for util.sortCardsByRank()
export const SUIT_S = 0
export const SUIT_H = 1
export const SUIT_C = 2
export const SUIT_D = 3
export const SUIT_NA = -1

// TRUMPS
export const TRUMP_UNSET = -2
export const TRUMP_NONE = -1
export const TRUMP_SPADES = SUIT_S
export const TRUMP_HEARTS = SUIT_H
export const TRUMP_CLUBS = SUIT_C
export const TRUMP_DIAMONDS = SUIT_D

// SWAPS
export const SWAP_REFUSE = -1

// CARDS
export const SA = SUIT_S * REQ_CARDS_PER_SUIT + 0
export const SK = SUIT_S * REQ_CARDS_PER_SUIT + 1
export const SQ = SUIT_S * REQ_CARDS_PER_SUIT + 2
export const SJ = SUIT_S * REQ_CARDS_PER_SUIT + 3
export const ST = SUIT_S * REQ_CARDS_PER_SUIT + 4
export const S9 = SUIT_S * REQ_CARDS_PER_SUIT + 5
export const HA = SUIT_H * REQ_CARDS_PER_SUIT + 0
export const HK = SUIT_H * REQ_CARDS_PER_SUIT + 1
export const HQ = SUIT_H * REQ_CARDS_PER_SUIT + 2
export const HJ = SUIT_H * REQ_CARDS_PER_SUIT + 3
export const HT = SUIT_H * REQ_CARDS_PER_SUIT + 4
export const H9 = SUIT_H * REQ_CARDS_PER_SUIT + 5
export const CA = SUIT_C * REQ_CARDS_PER_SUIT + 0
export const CK = SUIT_C * REQ_CARDS_PER_SUIT + 1
export const CQ = SUIT_C * REQ_CARDS_PER_SUIT + 2
export const CJ = SUIT_C * REQ_CARDS_PER_SUIT + 3
export const CT = SUIT_C * REQ_CARDS_PER_SUIT + 4
export const C9 = SUIT_C * REQ_CARDS_PER_SUIT + 5
export const DA = SUIT_D * REQ_CARDS_PER_SUIT + 0
export const DK = SUIT_D * REQ_CARDS_PER_SUIT + 1
export const DQ = SUIT_D * REQ_CARDS_PER_SUIT + 2
export const DJ = SUIT_D * REQ_CARDS_PER_SUIT + 3
export const DT = SUIT_D * REQ_CARDS_PER_SUIT + 4
export const D9 = SUIT_D * REQ_CARDS_PER_SUIT + 5

export const cardMap:string[] = [];
export const suitMap:string[] = [];
suitMap[SUIT_S] = 'S';
suitMap[SUIT_H] = 'H';
suitMap[SUIT_C] = 'C';
suitMap[SUIT_D] = 'D';
export const faceMap:string[] = ['A', 'K', 'Q', 'J', 'T', '9'];
for(const suitIdStr in suitMap) {
    const suitId = Number(suitIdStr);
    for(const faceIdStr in faceMap) {
        const faceId = Number(faceIdStr);
        cardMap[suitId * REQ_CARDS_PER_SUIT + faceId] = suitMap[suitId] + faceMap[faceId];
    }
}
