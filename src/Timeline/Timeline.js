import styled, { css } from "styled-components";
import Chart from "./Chart";
import ChartHeader from "./ChartHeader"

const ChartContainer = styled.div`
position: relative;
background-color: ${props => props.theme.chartBackgroundColor || '#f1f5f9'};
padding: 0px 64px 16px 64px;
border-radius: ${props => props.theme.chartBorderRadius};
overflow: hidden;
${props => props.theme.showChartBorder !== false ? css`
  border: 2px solid ${props.theme.chartBorderColor || '#1e293b'};` : ''}
`

export default function Timeline ({ events, saveChartEventsHook, swimlanes=true, theme }) {

  return (
    <ChartContainer theme={theme}>
      <ChartHeader theme={theme}>
      </ChartHeader>
      <Chart
        events={events}
        saveChartEventsHook={saveChartEventsHook}
        swimlanes={swimlanes}
        theme={theme}
      />
    </ChartContainer>
  );
}
