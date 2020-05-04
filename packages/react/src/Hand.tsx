import styled, { css } from 'styled-components';

export default styled.div`
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
