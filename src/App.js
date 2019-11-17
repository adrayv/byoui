import React from 'react';
import styled from 'styled-components';
import Dropdown from './components/dropdown';

const Button = styled.div`
  width: 100px;
  height: 25px;
  background: black;
`;

const Popover = styled.div`
  width: 150px;
  height: 150px;
  background: red;
`;

const Page = styled.div`
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 50px;
`;

function App() {
  return (
    <Page>
      <h1>Examples</h1>
      <Dropdown trigger={<Button />} flyout={<Popover />} flyoutPos="br" />
    </Page>
  );
}

export default App;
