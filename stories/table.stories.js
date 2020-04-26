import React from 'react';
import Card, { HandWrapper } from '../src/components/Card';
import Table from '../src/components/Table';

export default {
  title: 'Table',
  component: Table,
};

export const DefaultTable = () => (
  <Table icon="spades" background="default">
      <HandWrapper>
        <Card suit="S" face="A" />
        <Card suit="S" face="K" />
        <Card suit="S" face="Q" />
        <Card suit="S" face="J" disabled />
        <Card suit="S" face="T" />
        <Card suit="S" face="9" />
      </HandWrapper>
  </Table>
);

DefaultTable.story = {
  name: 'Default',
};
