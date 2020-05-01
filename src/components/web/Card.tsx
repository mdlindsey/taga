import React from 'react';
import styled, { css } from 'styled-components';
/*
    <Card />
    suit - letter of suit (eg: S)
    face - letter of face (eg: A, K, Q, 10=T)
    disabled - if truthy will dim the card and prevent uplift on hover for HandWrapper
*/
export interface CardProps {
    suit?: string
    face?: string
    disabled?: boolean
    onClick?: CardCallback
    onMouseOver?: CardCallback
}
export interface CardWrapperProps extends CardProps {
    children?: any
    className?: string
    onClick?: (event:any) => void
    onMouseOver?: (event:any) => void
}
export type CardCallback = (event?:any, card?:{suit:string, face:string}) => void;
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

export const HandWrapper:any = styled.div`
    display: inline-block;
    width: ${(props:{children?:any}) => props.children.length * 2 + 10}em;
    height: 18em;
    position: relative;
    left: ${(props:{children?:any}) => props.children.length * 0.2}em;
    -moz-transform: rotate(10deg);
    -webkit-transform: rotate(10deg);
    -o-transform: rotate(10deg);
    transform: rotate(1.75deg);
    .card {
        position: absolute;
        cursor: pointer;
        img {
            max-width: 10.675rem;
            max-height: 15rem;
        }
        :hover {
            margin-top: -2.5em;
            padding-bottom: 2.5em;
        }
    }
    .card.disabled {
        cursor: default;
        :hover {
            margin-top: 0;
            padding-bottom: 0;
        }
    }
    ${
        (props:{children?:any}) => {
            let styles = '';
            const offsetLeft = 2;
            const middle = (props.children.length - 1) / 2;
            for(let i = 0; i < props.children.length; i++) {
                // middle cards should be highest so get the min distance from either end for offset
                const style = `translate(${(i - middle) * 0.25}rem, ${Math.abs(i - middle) * 0.15}rem) rotate(${(i - middle) * 3}deg)`;
                styles += `.card:nth-of-type(${i+1}) {
                    left: ${i * offsetLeft}rem;
                    -moz-transform: ${style};
                    -webkit-transform: ${style};
                    -o-transform: ${style};
                    transform: ${style};
                }`
            }
            return css`${styles}`;
        }
    }
`;
