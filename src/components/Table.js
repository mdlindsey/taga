import React from 'react';
import styled, { css } from 'styled-components';
/*
    <Table />
    icon: spades | diamonds | hearts | clubs
    background: default | default-light | burlap | cardboard | fabric | felt | leather | noise | paper | pinstripe | slate | sublte | suede | twill
*/
export default ({ icon, background, children }) => {
    return (
        <TableWrapper icon={icon} background={background} className="table">
            { children }
        </TableWrapper>
    );
};

const tableIcon = icon => {
    switch(icon) {
        default:
        case 'spades':
            return '\\2660';
    }
};
const tableBackground = background => {
    switch(background.toLowerCase()) {
        case 'burlap':
        case 'cardboard':
        case 'default-light':
        case 'fabric':
        case 'felt':
        case 'leather':
        case 'noise':
        case 'paper':
        case 'pinstripe':
        case 'slate':
        case 'subtle':
        case 'suede':
        case 'twill':
            return background.toLowerCase();
        default:
            return 'default';
    }
};
const backgroundImage = file => {
    const img = require(`./assets/textures/${file}.png`);
    console.log(`./assets/textures/${file}.png`);
    console.log(btoa(img));
    return `data:image/png;base64,${btoa(img)}`;
};
const TableWrapper = styled.div`
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    padding-top: 10vh;
    width: 100vw;
    height: 100vh;
    min-height: 100vh;
    background: #436322;
    background-image: url('${props => backgroundImage(tableBackground(props.background))}'); /* fallback */
    background-image: url('${props => backgroundImage(tableBackground(props.background))}'), linear-gradient(-20deg, #71A338 0%, #436322 100%); /* W3C */
    /* background: linear-gradient(-20deg, #7eb53e 0%, #507528 100%); */
    
    ::after {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
        font-size: 20vw;
        text-align: center;
        color: rgba(0, 0, 0, 0.1);
        content: "${props => tableIcon(props.icon)}";
        text-shadow: 0px 1px 0px rgba(255,255,255,.05), 0px -1px 0px rgba(0,0,0,.1);
    }
`;
