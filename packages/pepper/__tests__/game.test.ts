import 'ts-jest';
import Pepper from '../src';
import { hands } from './__mocks__/pepper';
import { SWAP_REFUSE } from '../src/config';

// ------------ Game Engine Tests ---------------- //

describe('Game Engine Tests', () => {
  test('Instantiation', () => {
    const pepper = Pepper.New();
    expect(pepper.game.state).toMatchSnapshot();
  });

  test('Denormalize: Player #1 | Bid | NA', () => {
    const pepper = Pepper.New([
      {
        hands: hands.pepper,
        actions: []
      }
    ]);
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_BID);
    expect(pepper.game.state.player).toBe(0);
    expect(pepper.game.state.modifier).toBe(Pepper.Config.MOD_NA);
  });

  test('Denormalize: Bid | Pass | New Round', () => {
    const pepper = Pepper.New([
      {
        hands: hands.pepper,
        actions: [
          { id: Pepper.Config.ACTION_BID, payload: 0 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
        ]
      }
    ]);
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_DEAL);
  });

  test('Interaction: Must follow suit', () => {
    const pepper = Pepper.New([
      {
        hands: hands.threeBid,
        actions: [
          { id: Pepper.Config.ACTION_BID, payload: 3 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
          { id: Pepper.Config.ACTION_TRUMP, payload: -1 },
          { id: Pepper.Config.ACTION_PLAY, payload: Pepper.Config.SA },
        ]
      }
    ]);
    const mustFollowSuit = () => pepper.game.interact({ id: Pepper.Config.ACTION_PLAY, player: 1, payload: Pepper.Config.HA });
    expect(mustFollowSuit).toThrow(Error);
  });

  test('Interaction: Excessive bid', () => {
    const pepper = Pepper.New([
      {
        hands: hands.pepper,
        actions: []
      }
    ]);
    const excessiveBid = () => pepper.game.interact({ id: Pepper.Config.ACTION_BID, player: 0, payload: 99 });
    expect(excessiveBid).toThrow(Error);
  });

  test('Interaction: Invalid trump suit', () => {
    const pepper = Pepper.New([
      {
        hands: hands.pepper,
        actions: [
          { id: Pepper.Config.ACTION_BID, payload: 3 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
        ]
      }
    ]);
    const invalidTrump = () => pepper.game.interact({ id: Pepper.Config.ACTION_TRUMP, player: 0, payload: 99 });
    expect(invalidTrump).toThrow(Error);
  });

  test('Interaction: Invalid swap refusal', () => {
    const pepper = Pepper.New([
      {
        hands: hands.pepper,
        actions: [
          { id: Pepper.Config.ACTION_BID, payload: 6 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
          { id: Pepper.Config.ACTION_BID, payload: 0 },
          { id: Pepper.Config.ACTION_TRUMP, payload: -1 },
          { id: Pepper.Config.ACTION_SWAP, payload: 5 },
        ]
      }
    ]);
    const invalidSwapRefusal = () => pepper.game.interact({ id: Pepper.Config.ACTION_SWAP, player: 2, payload: SWAP_REFUSE });
    expect(invalidSwapRefusal).toThrow(Error);

    const unownedCard = () => pepper.game.interact({ id: Pepper.Config.ACTION_SWAP, player: 2, payload: 0 });
    expect(unownedCard).toThrow(Error);
  });

  test('Interaction: Unexpected action', () => {
    const pepper = Pepper.New();
    const unexpectedAction = () => pepper.game.interact({ id: Pepper.Config.ACTION_PLAY, player: 1, payload: Pepper.Config.SA });
    expect(unexpectedAction).toThrow(Error);
  });
  
  test('Flow: Player #1 | Pepper | No Trump | Swap', () => {
    const pepper = Pepper.New([
      {
        hands: hands.pepper,
        actions: []
      }
    ]);
    pepper.game.interact({ id: Pepper.Config.ACTION_BID, player: 0, payload: Pepper.Config.MAX_BID });
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_TRUMP);
    expect(pepper.game.state.player).toBe(0);
    expect(pepper.game.state.modifier).toBe(Pepper.Config.MOD_NA);

    pepper.game.interact({ id: Pepper.Config.ACTION_TRUMP, player: 0, payload: Pepper.Config.TRUMP_NONE });
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_SWAP);
    expect(pepper.game.state.player).toBe(0);
    expect(pepper.game.state.modifier).toBe(Pepper.Config.MOD_NA);

    pepper.game.interact({ id: Pepper.Config.ACTION_SWAP, player: 0, payload: Pepper.Config.S9 });
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_SWAP);
    expect(pepper.game.state.player).toBe(2);
    expect(pepper.game.state.modifier).toBe(Pepper.Config.MOD_NA);

    pepper.game.interact({ id: Pepper.Config.ACTION_SWAP, player: 2, payload: Pepper.Config.CA });
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_PLAY);
    expect(pepper.game.state.player).toBe(0);
    expect(pepper.game.state.modifier).toBe(Pepper.Config.MOD_NA);

    pepper.game.interact({ id: Pepper.Config.ACTION_PLAY, player: 0, payload: Pepper.Config.SA });
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_PLAY);
    expect(pepper.game.state.player).toBe(1);
    expect(pepper.game.state.modifier).toBe(Pepper.Config.SUIT_S);

    pepper.game.interact({ id: Pepper.Config.ACTION_PLAY, player: 1, payload: Pepper.Config.H9 });
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_PLAY);
    expect(pepper.game.state.player).toBe(3);
    expect(pepper.game.state.modifier).toBe(Pepper.Config.SUIT_S);

    pepper.game.interact({ id: Pepper.Config.ACTION_PLAY, player: 3, payload: Pepper.Config.D9 });
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_PLAY);
    expect(pepper.game.state.player).toBe(0);
    expect(pepper.game.state.modifier).toBe(Pepper.Config.MOD_NA);
  });  

  test('Flow: Player #1 | 3-Bid', () => {
    const pepper = Pepper.New([
      {
        hands: hands.pepper,
        actions: []
      }
    ]);

    pepper.game.interact({ id: Pepper.Config.ACTION_BID, player: 0, payload: 3 });
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_BID);
    expect(pepper.game.state.player).toBe(1);
    expect(pepper.game.state.modifier).toBe(3);

    pepper.game.interact({ id: Pepper.Config.ACTION_BID, player: 1, payload: 3 });
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_BID);
    expect(pepper.game.state.player).toBe(2);
    expect(pepper.game.state.modifier).toBe(3);

    pepper.game.interact({ id: Pepper.Config.ACTION_BID, player: 2, payload: 3 });
    expect(pepper.game.state.id).toBe(Pepper.Config.ACTION_BID);
    expect(pepper.game.state.player).toBe(3);
    expect(pepper.game.state.modifier).toBe(3);
  });
});
