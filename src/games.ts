import { act } from './games/pepper/bot.ts';
import { GameInstance } from './games/pepper/game.ts';

export default {
    Pepper: (roundData) => {
        const game = new GameInstance(roundData);
        return {
            game,
            bot: () => act(game)
        };
    }
};