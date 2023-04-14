import styled from "styled-components";

const ChartHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 16px;
  box-sizing: border-box;
`;

const ChartTitle = styled.h2`
  font-size: 32px;
  font-weight: bold;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 80%;
`;

const ChartDescription = styled.p`
  font-size: 16px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
`;

export default function ChartHeader ({ theme }) {
  return (
    <ChartHeaderContainer>
      {theme.title && <ChartTitle title={theme.title}>
          {theme.title}
        </ChartTitle>
      }
      {theme.description && <ChartDescription title={theme.description}>
          {theme.description}
        </ChartDescription>
      }
    </ChartHeaderContainer>
  );
}