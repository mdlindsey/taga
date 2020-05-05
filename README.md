# TagaJS

The OG library for all things related to table games including components for React (+Native), game engines, bots, and more. Checkout the [comprehensive storybook](https://taga.appspot.com) for use-cases and code examples.

## Issues

- [x] Fix TrickTaker logic
- [ ] PlayerID out of bounds (>=4) after all skip bids
- [ ] Implement scoring model (will also fix last trick taker of round issue)
- [ ] Ensure shortest sluff suit isn't highest card of suit (eg: only Spade is SA)

## Investigation

- [ ] Is `bot.cardRankBySuit()` needed?
- [ ] Should `util.sortCardsForHand()` be in this domain?

## Getting Started

This library contains multiple packages that are installed independently of each other using the `@taga` scope.

### React Components

Install via [`@taga/react`](https://www.npmjs.com/package/@taga/react)

React components fall into one of two categories, dynamic graphic rendering and wrapper styling.

#### Cards

The `<Card />` component dynamically renders graphics for playing cards given the prop inputs.

```js
// Show back of card
<Card />

// Show Ace of Spades
<Card suit="S" face="A" />

// Disabled card (dimmed out)
<Card suit="S" face="A" disabled />

// Alert card details when clicked
<Card suit="S" face="A" onClick={ card => alert(`You clicked ${card.suit}${card.face}`) } />
```

More examples available in [Storybook Demos](https://taga.appspot.com/storybook/cards).

#### Hands

The `<Hand />` HOC component wraps one or more `<Card />` components with dynamic styling to resemble how a player would hold a set of cards. Card position and rotation automagically adjust to the number of cards provided.

```js
<Hand>
    <Card suit="S" face="A" />
    <Card suit="S" face="K" />
    <Card suit="S" face="Q" />
    <Card suit="S" face="J" />
    <Card suit="S" face="T" />
</Hand>
```

More examples available in [Storybook Demos](https://taga.appspot.com/storybook/hands).

### React Native Components

Install via [`@taga/react-native`](https://www.npmjs.com/package/@taga/react-native)

Coming soon...

### Games

Each game is installed as a standalone package including a deterministic state engine accompanied by a bot to suggest next moves or fill in for absent players.

#### Pepper

Install via [`@taga/pepper`](https://www.npmjs.com/package/@taga/pepper)

More examples available in [Storybook Demos](https://taga.appspot.com/storybook/pepper).

## Built With

* [React](https://reactjs.org/) - Web component framework `@taga/react`
* [React Native](https://reactnative.dev/) - Mobile component library `@taga/react-native`
* [Lerna](https://lerna.js.org/) - Monorepo package management
* [Storybook](https://storybook.js.org/) - Unbeatable UI demos
* [TypeScript](https://www.typescriptlang.org/) - Make JS scalable
