import React, { useRef, useEffect, useState } from "react";
import { format } from "date-fns";
import "./App.css";
import TickLine from "./TickLine"

export default function Tick ({dayOffset, chartInfo, timeline, bars=true}) {
  
  // const [barHeight, setBarHeight] = useState(0);
  // const tickRef = useRef(null);
  // // console.log("tick mark bar was re-rendered")

  const getOffsetDate = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const timelineStart = new Date(timeline.startDate);
  const tickDate = getOffsetDate(timelineStart, dayOffset);
  // console.log(tickDate)

  const getContainerOffset = () => {
    const locationRatio = dayOffset / timeline.totalDays;
    return locationRatio * chartInfo.containerWidth;
  };

  // useEffect(() => {
  //   if (tickRef.current){
  //     // console.log(tickRef)
  //     const chartRef = tickRef.current.parentNode.parentNode;
  //     const tickmarkBarRef = tickRef.current.parentNode;
  //     setBarHeight(chartRef.clientHeight - tickmarkBarRef.clientHeight);
  //   }
  // }, [tickRef]);


  const barHeight = (bars ? chartInfo.chartHeight : 0);
  
  return(
    <div
      className="tick"
      style={{
        left: `${getContainerOffset()}px`
      }}
    >
      <TickLine height={barHeight}/>
      <p className="tick-dates">
        {format(tickDate, "MMM d, yyyy")}
      </p>
    </div>
  );
}