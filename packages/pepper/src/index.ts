import * as Types from './@types';
import * as Util from './util';
import * as Config from './config';
import { GameInstance } from './game';
import { act } from './bot';

export default {
    Types,
    Util,
    Config,
    GameInstance,
    New: (roundData:[]) => {
        const game = new GameInstance(roundData);
        return {
            game,
            bot: () => act(game)
        };
    }
};