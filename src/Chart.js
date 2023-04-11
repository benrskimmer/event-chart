import "./App.css";
import Row from "./Row";
import TickmarksBar from "./TickmarkBar";
import React, { useState, useRef, useEffect } from "react";
import { parseISO, differenceInDays } from "date-fns";

export default function Chart ({ events, swimlanes }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const scrollZoomSensitivity = 0.8;
  const scrollPanSensitivity = 0.5;  // pan on scroll if alt key is held
  const timeline = {
    startDate: "",
    endDate: "",
    totalDays: 0
  };
  let zoomScaleLimit = 1;  // defaults to 1, calculated when creating rows
  const [chartInfo, setContainerPosition] = useState({
    chartHeight: 0,
    chartWidth: 0,
    containerWidth: null,
    containerLeftOffset: 0,
    zoomRatio: 1
  });
  const [panStart, setPanStart] = useState(0);

  const addEventToRows = (rows, event) => {
    for (const row of rows) {
      const lastEvent = row[row.length - 1];
      if (event.start > lastEvent.end) {
        row.push(event);
        return;
      }
    }
    rows.push([event]);
  };

  const latestDate = (lastDate, date) => {
    return (Date.parse(date) > Date.parse(lastDate)) ? date : lastDate;
  };

  const shortestDaySpan = (shortestSpan, days) => {
    return (days < shortestSpan) ? days : shortestSpan;
  }

  const calculateEventDays = event => {
    return differenceInDays(parseISO(event.end), parseISO(event.start));
  };

  const getTimelineRows = events => {
    let sortedEvents = events.map(a => ({...a}))  // deep copy to ensure component is pure
    sortedEvents.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));

    let lastDate = sortedEvents[0].end;
    let shortestEventDays = calculateEventDays(sortedEvents[0]);

    let rows = [];
    sortedEvents.forEach(event => {
      addEventToRows(rows, event);
      lastDate = latestDate(lastDate, event.end);
      shortestEventDays = shortestDaySpan(shortestEventDays, calculateEventDays(event));
    });
    timeline.startDate = parseISO(sortedEvents[0].start);
    timeline.endDate = parseISO(lastDate);
    timeline.totalDays = differenceInDays(timeline.endDate, timeline.startDate);
    zoomScaleLimit = (timeline.totalDays / shortestEventDays);
    return rows;
  };

  const boundedZoom = zoom => {
    const minimumWidth = chartRef.current.clientWidth;
    const maximumWidth = zoomScaleLimit * chartRef.current.clientWidth;
    return Math.round(Math.min(Math.max(zoom, minimumWidth), maximumWidth));
  };

  const unviewableWidth = width => (width - chartRef.current.clientWidth)

  const boundedLeftOffset = (offset, width = containerRef.current.clientWidth) => {
    const maxLeftOffset = (0 - unviewableWidth(width));  // negative value to shift container left
    const maxRightOffset = 0;
    return Math.min(Math.max(offset, maxLeftOffset), maxRightOffset);
  };

  const containerLeftOffset = () => (chartRef.current.offsetLeft - containerRef.current.offsetLeft);

  const cursorViewableOffset = event => (event.clientX - chartRef.current.offsetLeft);

  const eventContainerPivotRatio = event => {
    const containerPivotOffset = cursorViewableOffset(event) + containerLeftOffset();
    return containerPivotOffset / (containerRef.current.clientWidth - 1);  // offset is 0 indexed so -1
  };

  const scrollPan = event => {
    setContainerPosition( oldPosition => {
      const newPosition = {...oldPosition};
      const panIncrement = 0.001 * chartRef.current.clientWidth;
      const panDistance = (event.deltaY * scrollPanSensitivity * panIncrement);
      newPosition.containerLeftOffset = boundedLeftOffset(oldPosition.containerLeftOffset + panDistance);
      return newPosition;
    });
  };

  const scrollZoom = event => {
    setContainerPosition( oldPosition => {
      const newPosition = {...oldPosition};
      const previousWidth = oldPosition.containerWidth ? oldPosition.containerWidth : containerRef.current.clientWidth;
      const zoomIncrement = 0.001 * previousWidth;

      newPosition.containerWidth = boundedZoom(previousWidth - (event.deltaY * scrollZoomSensitivity * zoomIncrement));
      newPosition.zoomRatio = newPosition.containerWidth / chartRef.current.clientWidth;
      const widthIncrease = newPosition.containerWidth - previousWidth;
      const additionalLeftShiftAmount = 0 - eventContainerPivotRatio(event) * widthIncrease;
      newPosition.containerLeftOffset = boundedLeftOffset(
        oldPosition.containerLeftOffset + additionalLeftShiftAmount, newPosition.containerWidth
      );
      // console.log('width increase: ', widthIncrease);
      // console.log('container pivot ratio: ', eventContainerPivotRatio(event));
      // console.log('old container position: ', oldPosition);
      // console.log('new container position: ', newPosition);
      // console.log('\n')
      return newPosition;
    });
  };

  function handleScroll(event) {
    if(event.altKey === true) {
      scrollPan(event);
      return;
    }
    scrollZoom(event);
  }

  const handleMouseDown = event => setPanStart(event.clientX);
  
  function handleMouseMove(event) {
    if(event.buttons !== 1)
      return;
    const panDistance = event.clientX - panStart;
    setContainerPosition( oldPosition => {
      const newPosition = {...oldPosition};
      newPosition.containerLeftOffset = boundedLeftOffset(oldPosition.containerLeftOffset + panDistance);
      return newPosition;
    });
    setPanStart(event.clientX);
  }

  const setOriginalChartInfo = () => {
    setContainerPosition( oldPosition => {
      const newPosition = {...oldPosition};
      if (newPosition.containerWidth === null)
        newPosition.chartHeight = containerRef.current.clientHeight;
        newPosition.chartWidth = containerRef.current.clientWidth;
        newPosition.containerWidth = containerRef.current.clientWidth;
      return newPosition;
    });
  };

  useEffect(() => {  // set the initial state of the props once the window has loaded
    setOriginalChartInfo();
  }, [containerRef]);

  const timelineRows = getTimelineRows(events);
  
  return (
    <div
      ref={chartRef}
      // style={{border: '4px solid red'}}
    >
      <div
        ref={containerRef}
        className="container"
        onWheel={handleScroll}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        style={{
          width: `${chartInfo.containerWidth}px`,
          left: `${chartInfo.containerLeftOffset}px`
        }}
      >
        {timelineRows.map((events, index) => (
          <Row
            key={index}
            events={events}
            timeline={timeline}
            swimlaneOn={(index % 2 && swimlanes)}
          />
        ))}
        <TickmarksBar
          chartInfo={chartInfo}
          timeline={timeline}
          bars={true}
        />
        {/* <div
          className="tick-marks"
        >
          
          
        </div> */}
      </div>
    </div>
  );
}
