import React from 'react';
import styled from 'styled-components';
import { CardWrapperProps, CardProps } from './@types';
/*
    <Card />
    suit - letter of suit (eg: S)
    face - letter of face (eg: A, K, Q, 10=T)
    disabled - if truthy will dim the card and prevent uplift on hover for HandWrapper
*/
// Wrap the cards with the max dimensions of the smallest image (back.png)
const CardWrapper:any = styled.span`
    img {
        max-width: 427px;
        max-height: 600px;
    }
    ${
        (props:CardWrapperProps) => props.disabled && `
            ::after {
                content:'';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                z-index: 1;
                width: 100%;
                height: 100%;
                border-radius: 10px;
                background: rgba(0, 0, 0, .6);
            }
        `
    }
`;
export default ({ suit='', face='', disabled=false, onClick=()=>{}, onMouseOver=()=>{} }:CardProps) => {
    const cardImg = validSuit(suit) && validFace(face) ? String(suit + face).toUpperCase() : 'BACK';
    return (
        <CardWrapper
            disabled={disabled}
            onClick={(e:any) => onClick(e,{suit,face})} 
            onMouseOver={(e:any) => onMouseOver(e,{suit,face})}
            className={['card', disabled ? 'disabled' : ''].join(' ')}>
            <img src={ require(`../assets/cards/${cardImg}.png`) } alt={`${face}${suit}`} />
        </CardWrapper>
    );
};
const isStr = (str:any) => typeof str === 'string' || str instanceof String;
const validSuit = (suit:string) => {
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
const validFace = (face:string) => {
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
