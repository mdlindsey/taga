import {
    SA, SK, SQ, SJ, ST, S9,
    HA, HK, HQ, HJ, HT, H9,
    CA, CK, CQ, CJ, CT, C9,
    DA, DK, DQ, DJ, DT, D9,
} from '../src/games/pepper/config';

export const hands = {
    pepper: [
        [SA, SK, SQ, SJ, ST, S9],
        [HA, HK, HQ, HJ, HT, H9],
        [CA, CK, CQ, CJ, CT, C9],
        [DA, DK, DQ, DJ, DT, D9],
    ],
    pepperTrump: [
        [SA, SK, SQ, SJ, ST, CJ],
        [HA, HK, HQ, HJ, HT, H9],
        [CA, CK, CQ, S9, CT, C9],
        [DA, DK, DQ, DJ, DT, D9],
    ],
    playerTwoPepper: [
        [SA, DK, CQ, SJ, DT, S9],
        [HA, HK, HQ, HJ, HT, H9],
        [CA, SK, DQ, CJ, ST, C9],
        [DA, CK, SQ, DJ, CT, D9],
    ],
    playerTwoPepperTrump: [
        [SA, DK, CQ, SJ, DT, S9],
        [HA, HK, HQ, HJ, HT, DJ],
        [CA, SK, DQ, CJ, ST, C9],
        [DA, CK, SQ, H9, CT, D9],
    ]
};