import React from 'react';
import styled from 'styled-components';
import Card, { HandWrapper } from '../src/components/Card';
import Table from '../src/components/Table';

export default {
  title: 'Table',
  component: Table,
};

const BottomCenterWrapper = styled.div`
  position: fixed;
  bottom: -6rem;
  width: 100%;
  text-align: center;
`;

export const DefaultTable = () => (
  <Table icon="spades" background="default">
      <BottomCenterWrapper>
        <HandWrapper>
          <Card suit="S" face="A" />
          <Card suit="S" face="K" />
          <Card suit="S" face="Q" />
          <Card suit="S" face="J" disabled />
          <Card suit="S" face="T" />
          <Card suit="S" face="9" />
        </HandWrapper>
      </BottomCenterWrapper>
  </Table>
);

DefaultTable.story = {
  name: 'Default',
};
