import React, { useState } from 'react';
import styled from 'styled-components';
import Card, { HandWrapper } from '../src/components/web/Card';
import { hands } from '../__mocks__/pepper';
import Pepper from '../src/games/pepper';
import { RoundData } from '../src/games/pepper/@types';

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

const BottomCenterWrapper = styled.div`
  position: fixed;
  bottom: -6rem;
  width: 100%;
  text-align: center;
`;

const CenterWrapper = styled.div`
  position: fixed;
  z-index: 99999;
  bottom: 50%;
  width: 100%;
  text-align: center;
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
  const nextMove = () => {
    try {
      game.interact({ id: game.state.id, player: game.state.player, payload: game.bot() });
    } catch(e) {
      alert(e);
    }
    setGame(Pepper(game.data));
  };
  return (
    <TableWrapper className="table">
      <CenterWrapper>
        <h2>State:</h2>
        <h1>
          State: {`
            {
              ${game.state.id},
              ${game.state.player},
              ${game.state.modifier},
              ${game.bot()}
            }
          `}
        </h1>
        <button onClick={ () => nextMove() }>Bot</button>
      </CenterWrapper>
      <BottomCenterWrapper>
        <HandWrapper>
          <Card suit="S" face="A" />
          <Card suit="S" face="K" />
          <Card suit="S" face="Q" />
          <Card suit="S" face="J" disabled />
          <Card suit="S" face="T" />
          <Card suit="S" face="9" />
        </HandWrapper>
      </BottomCenterWrapper>
    </TableWrapper>
  );
};

PepperTable.story = {
  name: 'Pepper Game',
};
