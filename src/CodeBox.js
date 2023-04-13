import React from 'react';
import styled from 'styled-components';

const Box = styled.pre`
  background-color: #282c34;
  border: 5px solid #6a737d;
  border-radius: 4px;
  padding: 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  white-space: pre-wrap;
  overflow-x: auto;
  color: #f8f8f2;
`;

function CodeBox({ keyName, theme }) {
  return (
    <div>
      <h2>{`Theme - ${keyName}`}</h2>
      <Box>
        <code>{JSON.stringify(theme, null, 2)}</code>
      </Box>
    </div>
  );
}

export default CodeBox;
