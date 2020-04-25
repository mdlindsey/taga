import React from 'react';
import styled from 'styled-components';
/*
    <Card />
    suit - letter of suit (eg: S)
    face - letter of face (eg: A, K, Q, 10=T)
*/
export default ({ suit, face, onClick=()=>{}, onMouseOver=()=>{}}) => {
    const cardImg = validSuit(suit) && validFace(face) ? String(suit + face).toUpperCase() : 'BACK';
    return (
        <CardWrapper onClick={e => onClick(e,{suit,face})} onMouseOver={e => onMouseOver(e,{suit,face})} className="--Card">
            <img src={ require(`./assets/cards/${cardImg}.png`) } alt={`${face}${suit}`} />
        </CardWrapper>
    );
};
const isStr = str => typeof str === 'string' || str instanceof String;
const validSuit = (suit) => {
    if (!isStr(suit))
        return false;
    switch(suit.toUpperCase()) {
        case 'S':
        case 'H':
        case 'C':
        case 'D':
            return true;
        default:
            return false;
    }
};
const validFace = (face) => {
    if (!isStr(face))
        return false;
    switch(face.toUpperCase()) {
        case 'A':
        case 'K':
        case 'Q':
        case 'J':
        case 'T':
        case '9':
        case '8':
        case '7':
        case '6':
        case '5':
        case '4':
        case '3':
        case '2':
            return true;
        default:
            return false;
    }
};
const CardWrapper = styled.span`
    img {
        max-width: 427px;
        max-height: 600px;
    }
`;
