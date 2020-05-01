// import React, { useState } from 'react';
// import Markdown from 'react-markdown';
// import styled from 'styled-components';
// import { linkTo } from '@storybook/addon-links';
// // import Readme from '../README.md';

// export default {
//   title: 'Welcome',
//   component: <></>,
// };

// export const Intro = () => (
//   <>
//     <h1>Welcome to Deckd</h1>
//     <button onClick={linkTo('Cards', 'Dynamic Hands')}>Dynamic Hands</button>
//   </>
// );

// Intro.story = {
//   name: 'Intro',
// };

// export const README = () => {
//   const [src, setSrc] = useState('');
//   if (!src) {
//     fetch(Readme).then(res => res.text()).then(text => setSrc(text)).catch(err => alert(''));
//   }
//   return (
//     <Markdown source={src} />
//   );
// };

// README.story = {
//   name: 'README',
// };
