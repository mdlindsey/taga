import React from 'react';
import styled from 'styled-components';
import Card, { HandWrapper } from '../src/components/Card';

export default {
  title: 'Card',
  component: Card,
};

export const DefaultCard = () => <Card />;

DefaultCard.story = {
  name: 'Default',
};

const onEvent = (e, { suit,face }) => alert(suit+face);
export const EventProps = () => <Card suit="S" face="A" onClick={onEvent} onMouseOver={onEvent} />;

EventProps.story = {
  name: 'Event Props',
};


const CardWrapper = styled.span`
  .card img {
    max-width: 150px;
    max-height: 217px;
  }
`;
export const StyledCard = () => <CardWrapper><Card suit="S" face="A" /></CardWrapper>;

StyledCard.story = {
  name: 'Custom Styling',
};

export const Hands = () => (
  <>
      <HandWrapper>
        <Card suit="S" face="A" />
        <Card suit="S" face="K" />
      </HandWrapper>
      <HandWrapper>
        <Card suit="S" face="A" />
        <Card suit="S" face="K" />
        <Card suit="S" face="Q" />
      </HandWrapper>
      <HandWrapper>
        <Card suit="S" face="A" />
        <Card suit="S" face="K" />
        <Card suit="S" face="Q" />
        <Card suit="S" face="J" />
        <Card suit="S" face="T" />
        <Card suit="S" face="9" />
      </HandWrapper>
      <HandWrapper>
        <Card suit="S" face="A" />
        <Card suit="S" face="K" />
        <Card suit="S" face="Q" />
        <Card suit="S" face="J" />
        <Card suit="S" face="T" />
        <Card suit="S" face="9" />
        <Card suit="S" face="8" />
        <Card suit="S" face="7" />
        <Card suit="S" face="6" />
        <Card suit="S" face="5" />
        <Card suit="S" face="4" />
        <Card suit="S" face="3" />
        <Card suit="S" face="2" />
      </HandWrapper>
  </>
);

Hands.story = {
  name: 'Grouped Hands',
};

export const DisabledCards = () => (
  <>
      <HandWrapper>
        <Card suit="S" face="A" />
        <Card suit="S" face="K" />
        <Card suit="S" face="Q" />
        <Card suit="S" face="J" disabled />
        <Card suit="S" face="T" />
        <Card suit="S" face="9" />
      </HandWrapper>
  </>
);

DisabledCards.story = {
  name: 'Disabled Cards',
};
