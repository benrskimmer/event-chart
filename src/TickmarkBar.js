import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import Tick from "./Tick"

export default function TickmarksBar ({timeline, chartInfo, ticks:suggestedTicks, bars=false}) {
  const defaultTickCount = 10;
  const targetTickCount = suggestedTicks || defaultTickCount;
  // const zoomRatio = 
  
  
  
  const getTickDates = () => {
    const totalTickCount = targetTickCount * chartInfo.zoomRatio;
    const timeBuckets = totalTickCount + 1;

    const chartBeginMultiplier = Math.abs(chartInfo.containerLeftOffset) / (chartInfo.containerWidth-1);
    const chartBeginDayOffset = Math.ceil(chartBeginMultiplier * timeline.totalDays);
    console.log('chart start day offset', chartBeginDayOffset);
    
    const chartEndPixelOffset = (Math.abs(chartInfo.containerLeftOffset) + chartInfo.chartWidth);
    const chartEndMultiplier = chartEndPixelOffset / (chartInfo.containerWidth-1);
    const chartEndDayOffset = Math.floor(chartEndMultiplier * timeline.totalDays);
    console.log('chart end day offset', chartEndDayOffset);

    const dayInterval = parseInt(timeline.totalDays / timeBuckets);
    const closestTickDayOffset = Math.ceil(chartBeginDayOffset / dayInterval) * dayInterval;

    console.log('timeline info: ', timeline)
    console.log('chart info: ', chartInfo)

    const tickDayOffsets = [];
    for (let i = closestTickDayOffset; i <= chartEndDayOffset; i += dayInterval) {
      tickDayOffsets.push(i);
    }
    console.log('tickDates: ', tickDayOffsets)
    return tickDayOffsets
  };
  
  const tickDates = getTickDates();

  return(
    <div
      className="tickmark-bar"
    >
      <div className="chart-bottom-line"></div>
      {tickDates.map((dayOffset, index) => (
        <Tick
          key={index}
          dayOffset={dayOffset}
          timeline={timeline}
          chartInfo={chartInfo}
        />
      ))}
    </div>
  );
}