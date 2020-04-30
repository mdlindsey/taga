import { act } from './bot';
import { RoundData } from './@types';
import { GameInstance } from './game';

export default (roundData:RoundData[]) => {
    return new GameInstance(roundData);
};