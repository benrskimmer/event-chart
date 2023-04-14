import styled from 'styled-components';

const Header = styled.h3`
  color: #1e293b;
  font-size: 20px;
  margin-bottom: 0px;
`

const Box = styled.pre`
  background-color: #fafaf9;
  border: 3px solid #1e293b;
  border-radius: 4px;
  padding: 1rem;
  font-family: 'Courier New', Courier, monospace;
  font-size: 14px;
  white-space: pre-wrap;
  overflow-x: auto;
  color: #0a0a0a;
`

export default function CodeBox({ keyName, theme }) {
  return (
    <div>
      <Header>
        {`Theme - ${keyName}`}
      </Header>
      <Box>
        <code>{JSON.stringify(theme, null, 2)}</code>
      </Box>
    </div>
  );
}
