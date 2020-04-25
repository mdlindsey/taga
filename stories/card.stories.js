import React from 'react';
import styled from 'styled-components';
import Card from '../src/components/Card';

export default {
  title: 'Card',
  component: Card,
};

export const DefaultCard = () => <Card />;

DefaultCard.story = {
  name: 'Default',
};

export const AceOfSpades = () => <Card suit="S" face="A" />;

AceOfSpades.story = {
  name: 'Ace of Spades',
};

export const ClickProp = () => <Card suit="S" face="A" onClick={ (e, { suit,face }) => alert(suit+face) } />;

ClickProp.story = {
  name: 'Click for CardID',
};

export const HoverProp = () => <Card suit="S" face="A" onMouseOver={ (e, { suit,face }) => alert(suit+face) } />;

HoverProp.story = {
  name: 'Hover for CardID',
};

const CardWrapper = styled.span`
  img {
    max-width: 150px;
    max-height: 217px;
  }
`;
export const StyledCard = () => <CardWrapper><Card suit="S" face="A" /></CardWrapper>;

StyledCard.story = {
  name: 'With Custom Styling',
};
