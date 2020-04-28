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

// CARDS
export const SA = 0
export const SK = 1
export const SQ = 2
export const SJ = 3
export const ST = 4
export const S9 = 5
export const HA = 6
export const HK = 7
export const HQ = 8
export const HJ = 9
export const HT = 10
export const H9 = 11
export const CA = 12
export const CK = 13
export const CQ = 14
export const CJ = 15
export const CT = 16
export const C9 = 17
export const DA = 18
export const DK = 19
export const DQ = 20
export const DJ = 21
export const DT = 22
export const D9 = 23