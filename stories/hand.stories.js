import React from 'react';
// import styled from 'styled-components';
import Hand from '../src/components/Hand';

export default {
  title: 'Hand',
  component: Hand,
};

export const DefaultHand = () => <Hand cards={[
        { suit: 'S', face: 'A' },
        { suit: 'S', face: 'K' },
        { suit: 'S', face: 'Q' },
        { suit: 'S', face: 'J' },
        { suit: 'S', face: 'T' },
    ]} />;

DefaultHand.story = {
  name: 'Default',
};

// export const StyledCard = () => <CardWrapper><Card suit="S" face="A" /></CardWrapper>;

// StyledCard.story = {
//   name: 'With Custom Styling',
// };
