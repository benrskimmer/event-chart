import "./App.css";
import Row from "./Row";
import React, { useState, useRef } from "react";
import { parseISO, differenceInDays } from "date-fns";

export default function Container ({ events }) {
  const scrollSensitivity = 0.8;
  const timeline = {
    startDate: "",
    endDate: "",
    totalDays: 0
  };
  let zoomScaleLimit = 1;  // defaults to 1, calculated when creating rows
  const [containerPosition, setContainerPosition] = useState({width: null, leftOffset: 0});

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
    const minimumWidth = viewableContainerRef.current.clientWidth;
    const maximumWidth = zoomScaleLimit * viewableContainerRef.current.clientWidth;
    return Math.round(Math.min(Math.max(zoom, minimumWidth), maximumWidth));
  };

  const unviewableWidth = newWidth => (newWidth - viewableContainerRef.current.clientWidth)

  const boundedLeftOffset = (offset, newWidth) => {
    const maxLeftOffset = (0 - unviewableWidth(newWidth));  // negative value to shift container left
    const maxRightOffset = 0;
    return Math.min(Math.max(offset, maxLeftOffset), maxRightOffset);
  };

  const containerLeftOffset = () => (viewableContainerRef.current.offsetLeft - containerRef.current.offsetLeft);

  const eventViewableOffset = event => (event.clientX - viewableContainerRef.current.offsetLeft);

  const eventContainerPivotRatio = event => {
    const containerPivotOffset = eventViewableOffset(event) + containerLeftOffset();
    return containerPivotOffset / (containerRef.current.clientWidth - 1);
  };

  function handleScroll(event) {
    const { deltaY: deltaScrollY } = event;

    setContainerPosition(oldPosition => {
      const previousWidth = oldPosition.width ? oldPosition.width : containerRef.current.clientWidth;
      const zoomIncrement = 0.001 * previousWidth;
      const newPosition = {};

      newPosition.width = boundedZoom(previousWidth - (deltaScrollY * scrollSensitivity * zoomIncrement));
      const widthIncrease = newPosition.width - previousWidth;
      const additionalLeftShiftAmount = 0 - eventContainerPivotRatio(event) * widthIncrease;
      newPosition.leftOffset = boundedLeftOffset(
        oldPosition.leftOffset + additionalLeftShiftAmount, newPosition.width
      );
      console.log('width increase: ', widthIncrease);
      console.log('container pivot ratio: ', eventContainerPivotRatio(event));
      console.log('old container position: ', oldPosition);
      console.log('new container position: ', newPosition);
      console.log('\n')
      return newPosition;
    });
  }

  const timelineRows = getTimelineRows(events);
  const containerRef = useRef(null);
  const viewableContainerRef = useRef(null);
  

  return (
    <div
      ref={viewableContainerRef}
    >
      <div
        ref={containerRef}
        className="container"
        onWheel={handleScroll}
        // onClick={}
        style={{
          width: `${containerPosition.width}px`,
          left: `${containerPosition.leftOffset}px`
        }}
      >
        {timelineRows.map((events, index) => (
          <Row
            key={index}
            events={events}
            timeline={timeline}
          />
        ))}
        <div className="tick-marks"></div>
      </div>
    </div>
  );
}
