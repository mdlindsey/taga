import React from 'react';
import Card, { HandWrapper } from '../src/components/Card';

export default {
  title: 'Hands',
  component: Card,
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
      </HandWrapper>
      <HandWrapper>
        <Card suit="S" face="A" />
        <Card suit="S" face="K" />
        <Card suit="S" face="Q" />
        <Card suit="S" face="J" />
        <Card suit="S" face="T" />
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