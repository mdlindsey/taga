import {
    SA, SK, SQ, SJ, ST, S9,
    HA, HK, HQ, HJ, HT, H9,
    CA, CK, CQ, CJ, CT, C9,
    DA, DK, DQ, DJ, DT, D9,
} from '../../src/config';

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
    threeBid: [
        [SA, SK, S9, HK, CK, DK],
        [HA, HQ, SJ, HT, H9, ST],
        [CA, CQ, HJ, CT, C9, DJ],
        [DA, DQ, CJ, DT, D9, SQ],
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