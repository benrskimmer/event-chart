import styled, { css } from "styled-components";
import Chart from "./Chart";

const ChartContainer = styled.div`
  ${props => props.theme.showChartBorder && css`
    border: 2px solid ${props => props.theme.chartBorderColor};
  `}
  background-color: ${props => props.theme.chartBackgroundColor};
  padding: 48px 64px 16px 64px;
  border-radius: ${props => props.theme.chartBorderRadius};
  overflow: hidden;
`

export default function Timeline ({ events, setEvents, swimlanes=true, theme }) {
  return (
    <ChartContainer theme={theme}>
      <Chart
        events={events}
        setEvents={setEvents}
        swimlanes={swimlanes}
        theme={theme}
      />
    </ChartContainer>
  );
}
