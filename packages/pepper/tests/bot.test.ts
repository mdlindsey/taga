import Pepper from '../src';
import { hands } from '../../../__mocks__/pepper';

// ------------ Game Bot Tests ---------------- //

describe('Game Bot Tests', () => {
  test('Bot: Player #1 | Bid | Pepper | No Trump', () => {
    const pepper = Pepper.New([
      {
        hands: hands.pepper,
        actions: []
      }
    ]);
    expect(pepper.bot()).toBe(Pepper.Config.MAX_BID);
  });
  
  test('Bot: Play full round', () => {
    const pepper = Pepper.New([
      {
        hands: hands.threeBid,
        actions: []
      }
    ]);
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_BID);
    let i = 0;
    while(pepper.game.state.id !== Pepper.Config.ACTION_DEAL) {
      const action = { id: pepper.game.state.id, player: pepper.game.state.player, payload: pepper.bot() };
      pepper.game.interact(action);
      console.log(`Bot performing move #${++i}: ${Pepper.Util.translateAction(action)}`)
    }
    expect(pepper.game.round.plays.length).toBe(Pepper.Config.REQ_PLAYERS * Pepper.Config.REQ_CARDS_PER_PLAYER);
  });
});
