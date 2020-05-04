import Pepper from '../src';
import { hands } from '../../../__mocks__/pepper';

// ------------ Game Engine Snapshot Tests ---------------- //

describe('Game Engine Snapshot Tests', () => {
  test('Empty Instance', () => {
    const pepper = Pepper.New();
    expect(pepper.game.state).toMatchSnapshot();
  });

  test('Denormalization: Player #1 | Bid | NA', () => {
    const pepper = Pepper.New([
      {
        hands: hands.pepper,
        actions: []
      }
    ]);
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_BID);
    expect(pepper.game.state.player).toBe(0);
    expect(pepper.game.state.id).toBe(Pepper.Config.MOD_NA);
  });

  test('Bot: Player #1 | Bid | Pepper | No Trump', () => {
    const pepper = Pepper.New([
      {
        hands: hands.pepper,
        actions: []
      }
    ]);
    expect(pepper.bot()).toBe(Pepper.Config.MAX_BID);
  });
});
