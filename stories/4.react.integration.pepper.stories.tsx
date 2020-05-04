import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Pepper from '../packages/pepper/src';
import { Card, Hand } from '../packages/react/src';

export default {
  title: 'Integrations.React',
  component: Card,
};

const { Config: {
  cardMap,
  ACTION_PLAY,
} } = Pepper;

const BottomHandWrapper = styled.div`
  position: fixed;
  bottom: -6rem;
  width: 100%;
  text-align: center;
`;

const LeftHandWrapper = styled.div`
  position: fixed;
  top: calc(50% - 12rem);
  left: calc(-50% + 3rem);
  width: 100%;
  text-align: center;
  transform: rotate(90deg);
`;

const RightHandWrapper = styled.div`
  position: fixed;
  top: calc(50% - 12rem);
  right: calc(-50% + 3rem);
  width: 100%;
  text-align: center;
  transform: rotate(-90deg);
`;

const TopHandWrapper = styled.div`
  position: fixed;
  top: -6rem;
  width: 100%;
  text-align: center;
  transform: rotate(180deg);
`;

const CenterWrapper = styled.div`
  position: fixed;
  z-index: 99999;
  bottom: 50%;
  width: 100%;
  text-align: center;

  div {
    position: absolute;
    margin-top: -6rem;
    left: calc(50% - 5.325rem);
  }

  .card img {
    max-height: 15rem;
  }

  .index-0 {
    bottom: -18rem;
  }

  .index-1 {
    transform: rotate(90deg);
    margin-left: -10rem;
  }

  .index-2 {
    bottom: 3rem;
    transform: rotate(180deg);
  }

  .index-3 {
    transform: translate(10rem, 0) rotate(270deg);
  }

  ${props => {
    switch(props.className) {
      case 'slide-0':
        return 'bottom: -100%; transition: all 0.3s ease-in-out;'
      case 'slide-1':
        return 'transform: translateX(-100%); transition: all 0.3s ease-in-out;'
      case 'slide-2':
        return 'bottom: 200%; transition: all 0.3s ease-in-out;'
      case 'slide-3':
        return 'transform: translateX(100%); transition: all 0.3s ease-in-out;'
      default:
        return '';
    }
  }}

`;

const FeedWrapper = styled.div`
  position: fixed;
  z-index: 99999;
  left: 0;
  bottom: 0;
  width: 350px;
  border: 1px solid black;
  background: rgba(255, 255, 255, 0.3);

  pre {
    margin: 0;
    padding: 6px;
    background: rgba(255, 255, 255, 0.3);
  }

  ul {
    list-style: none;
    height: 90px;
    padding: 3px 0;
    margin: 0;
    overflow: scroll;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      display: none;
    }
    li {
      font-size: 14px;
      padding: 3px 6px;
    }
  }

  pre:last-of-type, button {
    display: inline-block;
    width: calc(65% - 12px);
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-left: none; border-right: none;
  }

  pre {
    padding: 7px 6px;
  }

  button {
    padding: 6px 0;
    width: 35%;
  }
`;

const TableWrapper = styled.div`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    padding-top: 10vh;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    background: #436322;
    background-image: url('https://i.imgur.com/3R04wGC.png'); /* fallback */
    background-image: url('https://i.imgur.com/3R04wGC.png'), linear-gradient(-20deg, #71A338 0%, #436322 100%); /* W3C */
    
    ::after {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
        font-size: 20vw;
        text-align: center;
        color: rgba(0, 0, 0, 0.1);
        content: "\\2660";
        text-shadow: 0px 1px 0px rgba(255,255,255,.05), 0px -1px 0px rgba(0,0,0,.1);
    }
`;

export const PepperTable = () => {
  const [game, setGame] = useState(new Pepper.GameInstance([]));
  const [moves, setMoves] = useState([]);
  const [trick, setTrick] = useState([]);
  const [trickClass, setTrickClass] = useState('');
  const nextMove = () => {
    try {
      const nextAction = { id: game.state.id, player: game.state.player, payload: game.bot() };
      game.interact(nextAction);
      setGame(new Pepper.GameInstance(game.data));
      setMoves([...moves, nextAction]);
    } catch(e) {
      alert(e);
    }
  };
  const normalizeTrick = (trick:number[]):{ index:number, card:number }[] => {
    const norm = [];
    for(const cardId of trick) {
      for(const handIndex in game.round.hands) {
        if (game.round.hands[handIndex].includes(cardId)) {
          norm.push({ index: handIndex, card: cardId });
        }
      }
    }
    return norm;
  };
  const checkForNewRound = () => {
    if (game.state.id === Pepper.Config.ACTION_DEAL) {
      const rounds = [...game.data, { actions: [], hands: Pepper.Util.deal() }];
      setTrick([]);
      setTrickClass('');
      setGame(new Pepper.GameInstance(rounds));
    }
  };
  const HandSorter = (playerIndex:number) => {
    if (!game.round.hands || !game.round.hands.length) {
      return <></>;
    }
    return Pepper.Util.sortCardsForHand(game.round.hands[playerIndex], game.round.trump)
    .filter(c => !game.round.plays.includes(c)).map(cardId => (
      <Card suit={cardMap[cardId][0]} face={cardMap[cardId][1]} key={cardId}
        disabled={game.state.id === ACTION_PLAY && game.state.player !== playerIndex} />
    ));
  };
  useEffect(() => {
    setTrickClass('');
    const activeTrick = Pepper.Util.activeTrick(game.round.bids, game.round.plays);
    if (activeTrick.length) {
      setTrick(normalizeTrick(activeTrick));
      return;
    }
    const prevTrick = Pepper.Util.prevTrick(game.round.bids, game.round.plays);
    if (prevTrick.length) {
      setTrick(normalizeTrick(prevTrick));
      setTrickClass(`slide-${game.state.player}`);
      setTimeout(() => { setTrickClass(''); setTrick([]); }, 300);
    }
    checkForNewRound();
  }, [game]);
  checkForNewRound();
  return (
    <TableWrapper className="table">
      <FeedWrapper>
        <pre>
          Expecting { Pepper.Util.translateAction(game.state) }
        </pre>
        <ul>
          {
            moves.map((action, i:number) => (
              <li key={i}>
                {Pepper.Util.translateAction(action)}
              </li>
            ))
          }
        </ul>
        <pre>
          {Pepper.Util.translateAction({ id: game.state.id, player: game.state.player, payload: game.bot() })}
        </pre>
        <button onClick={ () => nextMove() }>Accept</button>
      </FeedWrapper>
      <CenterWrapper className={trickClass}>
        {
          trick.map(info => (
            <div className={`index-${info.index}`} key={info.index}>
              <Card suit={cardMap[info.card][0]} face={cardMap[info.card][1]} />
            </div>
          ))
        }
      </CenterWrapper>
      <BottomHandWrapper>
        <Hand>
          {
            HandSorter(0)
          }
        </Hand>
      </BottomHandWrapper>
      <LeftHandWrapper>
        <Hand>
          {
            HandSorter(1)
          }
        </Hand>
      </LeftHandWrapper>
      <TopHandWrapper>
        <Hand>
          {
            HandSorter(2)
          }
        </Hand>
      </TopHandWrapper>
      <RightHandWrapper>
        <Hand>
          {
            HandSorter(3)
          }
        </Hand>
      </RightHandWrapper>
    </TableWrapper>
  );
};

PepperTable.story = {
  name: 'Pepper Bot',
};
