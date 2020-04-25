import React from 'react';
import styled from 'styled-components';
import Card from './Card';
/*
    <Hand />
    cards - array of suit/face objs (eg: {suit: 'S', face: 'A'})
    onClick/onMouseHover - passthrough to child <Card /> component
    playable - {
        strict (bool): if false and no playable cards can play anything
        rules (array): {
            _not? (bool): if true will negate the rule
            suit (str): if set will match this suit
            face (str): if set will match this face
        }
    }
*/
export default ({ cards=[], playable={}, onClick=()=>{}, onMouseOver=()=>{}}) => {
    return (
        <HandWrapper className="--Hand">
            {
                cards.map(({suit, face}) => <Card suit={suit} face={face} onClick={onClick} onMouseOver={onMouseOver} />)
            }
        </HandWrapper>
    );
};

const isPlayable = (card,rules) => {
    let matches = 0;
    if (!playable)
      return false;
    if (playable && (!Array.isArray(playable) || !playable.length))
      return true;
    if (Array.isArray(playable) && playable.length) {
      for(const condition of playable) {
        let conditionMatches = 0;
        for(const prop in condition) {
          if (prop.match(/^_/)) // skip _not and/or _required
            continue;
          if (card[prop] && card[prop] === condition[prop])
            conditionMatches++;
        }
        // make sure all props not starting with _ are matched
        const conditionProps = Object.keys(condition).filter(key => !key.match(/^_/)).length;
        const matched = conditionMatches === conditionProps;
        if (matched) 
          matches++;
        const noMatch = (!condition._not && conditionMatches !== conditionProps) || (condition._not && conditionMatches === conditionProps);
        if (noMatch && condition._required)
          return false;
      }
    }
    return matches > 0;
};
const HandWrapper = styled.span`

    .--Card {
        position: relative;
        left: -30px;
        img {
            width: 150px;
            height: 217px;
        }
        :first-of-type {
            left: 0;
        }
    }

`;
