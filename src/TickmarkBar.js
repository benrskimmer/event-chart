import Tick from "./Tick"
import styled from "styled-components";

const TickBar = styled.div`
  position: relative;
  top: 0px;
  height: 60px;
`

const ChartBottomLine = styled.div`
  position: absolute;
  border-top: 2px solid ${props => props.theme.tickColor};
  width: 100%;
  z-index: 2;
`

const getChartBeginDayOffset = (chartInfo, timeline) => {
  const chartBeginMultiplier = Math.abs(chartInfo.containerLeftOffset) / (chartInfo.containerWidth-1);
  return chartBeginMultiplier * timeline.totalDays;
};

const getChartEndDayOffset = (chartInfo, timeline) => {
  const chartEndPixelOffset = (Math.abs(chartInfo.containerLeftOffset) + chartInfo.chartWidth);
  const chartEndMultiplier = chartEndPixelOffset / (chartInfo.containerWidth-1);
  return chartEndMultiplier * timeline.totalDays;
};

const getViewableTicks = (allTickDayOffsets, chartInfo, timeline, marginDays) => {
  const chartBeginDayOffset = getChartBeginDayOffset(chartInfo, timeline);
  const chartEndDayOffset = getChartEndDayOffset(chartInfo, timeline);
  return allTickDayOffsets.filter(
    offset => offset > (chartBeginDayOffset - marginDays)
    && offset < (chartEndDayOffset + marginDays)
    );
}

const getTickDayOffsets = (timeline, chartInfo, targetTickCount, tickOverlapMargin) => {
  const totalTickCount = Math.round(targetTickCount * chartInfo.zoomRatio);
  const timeBuckets = totalTickCount + 1;
  const intervalDays = (timeline.totalDays) / timeBuckets;

  const tickDayOffsets = [];
  for (let i = 0; Math.round(i) <= timeline.totalDays; i += intervalDays) {
    tickDayOffsets.push(Math.round(i));
  }
  return getViewableTicks(tickDayOffsets, chartInfo, timeline, intervalDays);
};

export default function TickmarksBar ({timeline, chartInfo, theme}) {
  const defaultTickCount = 10;
  const tickDates = getTickDayOffsets(timeline, chartInfo, theme.tickCount || defaultTickCount);
  return(
    <TickBar>
      <ChartBottomLine
        theme={theme}
      />
      {tickDates.map((dayOffset, index) => (
        <Tick
          key={index}
          dayOffset={dayOffset}
          timeline={timeline}
          chartInfo={chartInfo}
          theme={theme}
        />
      ))}
    </TickBar>
  );
}
