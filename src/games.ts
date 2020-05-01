import { act } from './games/pepper/bot';
import { GameInstance } from './games/pepper/game';

export default {
    Pepper: (roundData:[]) => {
        const game = new GameInstance(roundData);
        return {
            game,
            bot: () => act(game)
        };
    }
};