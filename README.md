# TagaJS

The OG library for all things related to table games including components for React (+Native), game engines, bots, and more. Checkout the [comprehensive storybook](https://taga.appspot.com) for use-cases and code examples.

## Getting Started

This library contains multiple packages that are installed independently of each other using the `@taga` scope.

### [React Components](https://www.npmjs.com/package/@taga/react)

React components fall into one of two categories, dynamic graphic rendering and wrapper styling. To make these features available, install `@taga/react`.

#### [Cards](https://taga.appspot.com/storybook/cards)

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

#### [Hands](https://taga.appspot.com/storybook/hands)

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

### React Native Components

Coming soon... To make these features available, install `@taga/react-native`.

### Games

Each game is installed as a standalone package including a deterministic state engine accompanied by a bot to suggest next moves or fill in for absent players.

#### [Pepper](https://taga.appspot.com/storybook/pepper)

To make these features available, install [`@taga/pepper`](https://www.npmjs.com/package/@taga/pepper).

## Built With

* [React](https://reactjs.org/) - Web component framework `@taga/react`
* [React Native](https://reactnative.dev/) - Mobile component library `@taga/react-native`
* [Lerna](https://lerna.js.org/) - Monorepo package management
* [Storybook](https://storybook.js.org/) - Unbeatable UI demos
* [TypeScript](https://www.typescriptlang.org/) - Make JS scalable






Round issues:
- Everyone skipping doesn't reshuffle or stop at player #4
- LastTrickTaker not logging on last trick of round (expected but need solution)

Sluffing fixes:
- Make sure the shortest suit isn't the highest card of suit (eg: bot sluffed SA because it was only Spade)
- Highest of suit should not care about current trick, if the SA is played, SK is now highest but shouldn't be played on the same trick as SA

cardRankBySuit - is this needed?
sortCardsForHand - should this be somewhere else?