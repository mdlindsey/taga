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
