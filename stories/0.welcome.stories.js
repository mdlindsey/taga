import React from 'react';
import styled from 'styled-components';
import { linkTo } from '@storybook/addon-links';

export default {
  title: 'Welcome',
  component: {},
};

export const Intro = () => (
  <ReadmeWrapper className="markdown-body">
    <h1>Welcome to Deckd</h1>
    <button onClick={linkTo('Cards', 'Dynamic Hands')}>Dynamic Hands</button>
  </ReadmeWrapper>
);

Intro.story = {
  name: 'Intro',
};

const ReadmeWrapper = styled.div`
  font-family: Arial, sans-serif;
`;
