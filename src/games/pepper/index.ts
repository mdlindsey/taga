import { act } from './bot';
import { RoundData } from './@types';
import { GameInstance } from './game';

export default (roundData:RoundData) => {
    const game = new GameInstance(roundData);
    return {
        game,
        bot: () => act(game)
    };
};