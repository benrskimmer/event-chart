import Row from "./Row";
import TickmarksBar from "./TickmarkBar";
import React, { useState, useRef, useEffect } from "react";
import { parseISO, differenceInDays } from "date-fns";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  user-select: none;
  // overscroll-behavior-x: contain;
  // pointer-events: none;
`

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

const getTimelineRows = (events, timeline) => {
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
  timeline.zoomScaleLimit = (timeline.totalDays / shortestEventDays);
  return rows;
};

const boundedZoom = (zoom, chartRef, timeline) => {
  const minimumWidth = chartRef.current.clientWidth;
  const maximumWidth = timeline.zoomScaleLimit * chartRef.current.clientWidth;
  return Math.round(Math.min(Math.max(zoom, minimumWidth), maximumWidth));
};

const unviewableWidth = (width, chartRef) => (width - chartRef.current.clientWidth);

export default function Chart ({ events, setEvents, swimlanes, theme }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const rowRef = useRef(null);
  const scrollZoomSensitivity = 0.8;
  const scrollPanSensitivity = 0.5;  // pan scroll sensitivity if alt key is held
  const timeline = {
    startDate: "",
    endDate: "",
    totalDays: 0,
    zoomScaleLimit: 1  // defaults to 1, calculated when creating rows
  };

  const [chartInfo, setContainerPosition] = useState({
    chartHeight: 0,
    chartWidth: 0,
    containerWidth: null,
    containerLeftOffset: 0,
    zoomRatio: 1
  });
  const [panStart, setPanStart] = useState(0);

  const boundedLeftOffset = (offset, width = containerRef.current.clientWidth) => {
    const maxLeftOffset = (0 - unviewableWidth(width, chartRef));  // negative value to shift container left
    const maxRightOffset = 0;
    return Math.min(Math.max(offset, maxLeftOffset), maxRightOffset);
  };

  const containerLeftOffset = () => (chartRef.current.offsetLeft - containerRef.current.offsetLeft);

  const cursorViewableOffset = event => (event.clientX - chartRef.current.offsetLeft);

  const eventContainerPivotRatio = event => {
    const containerPivotOffset = cursorViewableOffset(event) + containerLeftOffset();
    return containerPivotOffset / (containerRef.current.clientWidth - 1);  // offset is 0 indexed so -1
  };

  const scrollPan = scrollAmount => {
    setContainerPosition( oldPosition => {
      const newPosition = {...oldPosition};
      const panIncrement = 0.001 * chartRef.current.clientWidth;
      const panDistance = (scrollAmount * scrollPanSensitivity * panIncrement);
      newPosition.containerLeftOffset = boundedLeftOffset(oldPosition.containerLeftOffset + panDistance);
      return newPosition;
    });
  };

  const scrollZoom = event => {
    setContainerPosition( oldPosition => {
      const newPosition = {...oldPosition};
      const previousWidth = oldPosition.containerWidth ? oldPosition.containerWidth : containerRef.current.clientWidth;
      const zoomIncrement = 0.001 * previousWidth;
      const newZoomWidth = previousWidth - (event.deltaY * scrollZoomSensitivity * zoomIncrement);
      
      newPosition.containerWidth = boundedZoom(newZoomWidth, chartRef, timeline);
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

  const handleResize = () => {
    setContainerPosition(oldChartInfo => {
      const newChartInfo = {...oldChartInfo};
      newChartInfo.chartWidth = chartRef.current.clientWidth;
      newChartInfo.containerWidth = Math.max(chartRef.current.clientWidth * oldChartInfo.zoomRatio, 1);
      newChartInfo.containerLeftOffset = oldChartInfo.containerLeftOffset * newChartInfo.containerWidth / oldChartInfo.containerWidth;
      return newChartInfo;
    })
  }

  function handleScroll(event) {
    event.stopPropagation()
    event.preventDefault();
    if(Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      scrollPan(-event.deltaX);
    }
    else if(event.altKey === false ^ theme.panOnScroll) {
      scrollZoom(event);
    } else {
      scrollPan(event.deltaY);
    }
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

  const disableBrowserBackBehavior = (event) => {
    console.log('disabling gesture behavior!')
    event.stopPropagation()
    event.preventDefault();
    document.documentElement.style.overscrollBehaviorX = 'none';
    document.body.style.overscrollBehaviorX = 'none';
    document.documentElement.style.overscrollBehaviorY = 'none';
    document.body.style.overscrollBehaviorY = 'none';
  };

  const enableBrowserBackBehavior = () => {
    console.log('re-enabling gesture behavior!')
    document.documentElement.style.overscrollBehaviorX = '';
    document.body.style.overscrollBehaviorX = '';
    document.documentElement.style.overscrollBehaviorY = '';
    document.body.style.overscrollBehaviorY = '';
  };

  const updateEvent = (event) => {
    setEvents(events.map(oldEvent => oldEvent.id === event.id ? event : oldEvent))
  }

  const timelineRows = getTimelineRows(events, timeline);

  const setOriginalChartInfo = () => {
    setContainerPosition( oldPosition => {
      const newPosition = {...oldPosition};
      newPosition.chartWidth = containerRef.current.clientWidth;
      newPosition.containerWidth = containerRef.current.clientWidth;
      return newPosition;
    });
  };

  const setRowsHeight = () => {
    setContainerPosition( oldPosition => {
      const newPosition = {...oldPosition};
        // console.log('rowRef.current.clientHeight', rowRef.current && rowRef.current.clientHeight)
        newPosition.chartHeight = rowRef.current && rowRef.current.clientHeight;
      return newPosition;
    });
  };

  useEffect(() => {  // set the initial state of the props once the window has loaded
    setOriginalChartInfo();
    const container = containerRef.current;
    container.addEventListener('wheel', handleScroll, {passive:false});
    container.addEventListener('mouseenter', disableBrowserBackBehavior, {passive:false});
    container.addEventListener('mouseleave', enableBrowserBackBehavior, {passive:false});

    return () => {
      container.removeEventListener('wheel', handleScroll);
      container.removeEventListener('mouseenter', disableBrowserBackBehavior);
      container.removeEventListener('mouseleave', enableBrowserBackBehavior);
    }
  }, [containerRef]);
  
  useEffect(() => {
    setRowsHeight();
  }, [rowRef]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, [])
  
  return (
      <div
        ref={chartRef}
      >
        <Container
          ref={containerRef}
          // onWheel={handleScroll}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          // onMouseEnter={disableBrowserBackBehavior}
          // onMouseLeave={enableBrowserBackBehavior}
          theme={theme}
          style={{
            width: `${chartInfo.containerWidth}px`,
            left: `${chartInfo.containerLeftOffset}px`
          }}
        >
          <div ref={rowRef}>
            {timelineRows.map((events, index) => (
              <Row
                key={index}
                events={events}
                updateEvent={updateEvent}
                timeline={timeline}
                swimlaneOn={(index % 2 && swimlanes)}
                theme={theme}
              />
            ))}
          </div>
            <TickmarksBar
              chartInfo={chartInfo}
              timeline={timeline}
              theme={theme}
            />
        </Container>
      </div>
  );
}
