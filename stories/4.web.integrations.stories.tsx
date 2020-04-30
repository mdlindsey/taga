import React, { useState } from 'react';
import styled from 'styled-components';
import Card, { HandWrapper } from '../src/components/web/Card';
import { hands } from '../__mocks__/pepper';
import Pepper from '../src/games/pepper';
import { RoundData, ActionInput } from '../src/games/pepper/@types';
import { actionName, suitName, cardName } from '../src/games/pepper/translate';
import { cardMap, ACTION_TRUMP, ACTION_BID, ACTION_PLAY } from '../src/games/pepper/config';

export default {
  title: 'Web.Integrations',
  component: Card,
};

const roundData:RoundData[] = [
  {
    actions: [],
    hands: hands.pepper
  }
];

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
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  transform: rotate(90deg);
`;

const RightHandWrapper = styled.div`
  position: fixed;
  top: calc(50% - 12rem);
  right: calc(-50% + 3rem);
  width: 100%;
  text-align: center;
  -webkit-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  transform: rotate(-90deg);
`;

const TopHandWrapper = styled.div`
  position: fixed;
  top: -6rem;
  width: 100%;
  text-align: center;
  -webkit-transform: rotate(180deg);
  -moz-transform: rotate(180deg);
  -o-transform: rotate(180deg);
  -ms-transform: rotate(180deg);
  transform: rotate(180deg);
`;

const CenterWrapper = styled.div`
  position: fixed;
  z-index: 99999;
  bottom: 50%;
  width: 100%;
  text-align: center;
`;

const FeedWrapper = styled.div`
  position: fixed;
  z-index: 99999;
  top: 5%;
  left: 0;
  width: 350px;
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
    /* background: linear-gradient(-20deg, #7eb53e 0%, #507528 100%); */
    
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
  const [game, setGame] = useState(Pepper(roundData));
  const [moves, setMoves] = useState([]);
  const nextMove = () => {
    try {
      const nextAction = { id: game.state.id, player: game.state.player, payload: game.bot() };
      game.interact(nextAction);
      setGame(Pepper(game.data));
      setMoves([...moves, nextAction]);
    } catch(e) {
      alert(e);
    }
  };
  return (
    <TableWrapper className="table">
      <FeedWrapper>
        <ul>
          {
            moves.map((action:ActionInput, i:number) => (
              <li key={i}>
                Player #{action.player+1} {actionName(action.id)}s&nbsp;
                {
                  action.id === ACTION_BID && `${action.payload}`
                }
                {
                  action.id === ACTION_TRUMP && suitName(action.payload)
                }
                {
                  action.id != ACTION_BID && action.id !== ACTION_TRUMP && cardName(action.payload)
                }
              </li>
            ))
          }
        </ul>
      </FeedWrapper>
      <CenterWrapper>
        <h2>State:</h2>
        <h1>
          State: {`
            {
              ${game.state.id},
              ${game.state.player},
              ${game.state.modifier}
            }
          `}
        </h1>
        <button onClick={ () => nextMove() }>Bot</button>
      </CenterWrapper>
      <BottomHandWrapper>
        <HandWrapper>
          {
            game.round.hands[0].filter(c => !game.round.plays.includes(c)).map(cardId => (
              <Card suit={cardMap[cardId][0]} face={cardMap[cardId][1]} disabled={game.state.id === ACTION_PLAY && game.state.player !== 0} />
            ))
          }
        </HandWrapper>
      </BottomHandWrapper>
      <LeftHandWrapper>
        <HandWrapper>
          {
            game.round.hands[1].filter(c => !game.round.plays.includes(c)).map(cardId => (
              <Card suit={cardMap[cardId][0]} face={cardMap[cardId][1]} disabled={game.state.id === ACTION_PLAY && game.state.player !== 1} />
            ))
          }
        </HandWrapper>
      </LeftHandWrapper>
      <TopHandWrapper>
        <HandWrapper>
          {
            game.round.hands[2].filter(c => !game.round.plays.includes(c)).map(cardId => (
              <Card suit={cardMap[cardId][0]} face={cardMap[cardId][1]} disabled={game.state.id === ACTION_PLAY && game.state.player !== 2} />
            ))
          }
        </HandWrapper>
      </TopHandWrapper>
      <RightHandWrapper>
        <HandWrapper>
          {
            game.round.hands[3].filter(c => !game.round.plays.includes(c)).map(cardId => (
              <Card suit={cardMap[cardId][0]} face={cardMap[cardId][1]} disabled={game.state.id === ACTION_PLAY && game.state.player !== 3} />
            ))
          }
        </HandWrapper>
      </RightHandWrapper>
    </TableWrapper>
  );
};

PepperTable.story = {
  name: 'Pepper Game',
};
