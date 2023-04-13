import { format } from "date-fns";
import TickLine from "./TickLine"
import styled from "styled-components";
import { useLayoutEffect, useRef } from "react";

const TickContainer = styled.div`
  position: absolute;
  z-index: 2;
`

const TickDate = styled.p`
  position: relative;
  font-size: 0.9rem;
  margin: 0;
  padding-top: 25px;
  left: -50%;
  white-space: nowrap;
  color: ${props => props.theme.tickTextColor}
`

const getOffsetDate = (date, days) => {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const getContainerOffset = (dayOffset, chartInfo, timeline) => {
  const locationRatio = dayOffset / timeline.totalDays;
  return locationRatio * chartInfo.containerWidth;
};

export default function Tick ({dayOffset, chartInfo, timeline, theme, updateTickMaxWidth}) {
  const timelineStart = new Date(timeline.startDate);
  const tickDate = getOffsetDate(timelineStart, dayOffset);
  const barHeight = (theme.showBars ? chartInfo.chartHeight : 0);
  const tickRef = useRef(null);

  useLayoutEffect( () => {
    updateTickMaxWidth(tickRef.current.clientWidth);
  }, [chartInfo.chartWidth, updateTickMaxWidth]);

  return(
    <TickContainer
      ref={tickRef}
      style={{
        left: `${getContainerOffset(dayOffset, chartInfo, timeline)}px`
      }}
    >
      <TickLine
        height={barHeight}
        theme={theme}
      />
      <TickDate
        theme={theme}
      >
        {format(tickDate, "MMM d, yyyy")}
      </TickDate>
    </TickContainer>
  );
}