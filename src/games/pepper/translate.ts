import {
    cardMap,
    suitMap,
} from './config';

export const actionName = (actionId:number):string => {
    switch(actionId) {
        case 0: return 'bid';
        case 1: return 'trump';
        case 2: return 'swap';
        case 3: return 'play';
        case -1: return 'deal';
    }
    return '';
};

export const suitName = (suitId:number):string => suitMap[suitId];

export const cardName = (cardId:number):string => cardMap[cardId];
