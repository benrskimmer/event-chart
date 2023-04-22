import Row from "./Row";
import TickmarksBar from "./TickmarkBar";
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { parseISO, differenceInDays } from "date-fns";
import styled from "styled-components";

const scrollZoomSensitivity = 0.8;
const scrollPanSensitivity = 0.5;  // pan scroll sensitivity if alt key is held
const pinchZoomSensitivity = 2;

const Container = styled.div`
  position: relative;
  user-select: none;
  touch-action: pan-y;
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
};

const calculateEventDays = event => {
  return differenceInDays(parseISO(event.end), parseISO(event.start));
};

const getTimelineRows = (events) => {
  let sortedEvents = events.map(a => ({...a}))  // deep copy to ensure component is pure
  sortedEvents.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
  let shortestEventDays = calculateEventDays(events[0]);
  let lastDate = sortedEvents[0].end;
  
  let rows = [];
  sortedEvents.forEach(event => {
    addEventToRows(rows, event);
    lastDate = latestDate(lastDate, event.end);
    shortestEventDays = shortestDaySpan(shortestEventDays, calculateEventDays(event));
  });

  const timeline = {}
  timeline.startDate = parseISO(sortedEvents[0].start);
  timeline.endDate = parseISO(lastDate);
  timeline.totalDays = differenceInDays(timeline.endDate, timeline.startDate);
  timeline.shortestEventDays = Math.max(shortestEventDays, 1);
  return [rows, timeline];
};

const boundedZoom = (chartInfo) => {
  const minimumWidth = chartInfo.chartWidth;
  const maximumWidth = chartInfo.zoomRatioLimit * chartInfo.chartWidth;
  return Math.min(Math.max(chartInfo.containerWidth, minimumWidth), maximumWidth);
};

const unviewableWidth = (chartInfo) => (chartInfo.containerWidth - chartInfo.chartWidth);

const boundedLeftOffset = (chartInfo) => {
  const maxLeftOffset = (0 - unviewableWidth(chartInfo));  // negative value to shift container left
  const maxRightOffset = 0;
  return Math.min(Math.max(chartInfo.containerLeftOffset, maxLeftOffset), maxRightOffset);
};

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


export default function Chart ({ events, saveChartEventsHook, swimlanes, theme }) {
  const containerRef = useRef(null);
  const chartRef = useRef(null);
  const rowRef = useRef(null);
  let timeline = {
    startDate: "",
    endDate: "",
    totalDays: 0,
    shortestEventDays: 1,
  };

  const [chartEvents, setChartEvents] = useState(events);

  const [chartInfo, setChartInfo] = useState({
    chartHeight: 0,
    chartWidth: 0,
    containerWidth: null,
    containerLeftOffset: 0,
    zoomRatio: 1,
    zoomRatioLimit: 1,
  });

  const [panStart, setPanStart] = useState(0);

  const [dragging, setDragging] = useState(false);

  const [pinching, setPinching] = useState(false);
  const [initialPinchInfo, setInitialPinchInfo] = useState({distance: 0, centerX: 0});

  const handleResize = () => {
    setChartInfo(oldChartInfo => {
      const newChartInfo = {...oldChartInfo};
      newChartInfo.chartWidth = chartRef.current.clientWidth;
      newChartInfo.containerWidth = Math.max(chartRef.current.clientWidth * oldChartInfo.zoomRatio, 1);
      newChartInfo.containerLeftOffset = oldChartInfo.containerLeftOffset * newChartInfo.containerWidth / oldChartInfo.containerWidth;
      return newChartInfo;
    });
  };

  const cursorViewableOffset = useCallback(cursorOffset => (cursorOffset - chartRef.current.offsetLeft), []);
  
  const eventContainerPivotRatio = useCallback((cursorOffset, currentOffsetLeft) => {
    const containerPivotOffset = cursorViewableOffset(cursorOffset) + Math.abs(currentOffsetLeft);
    return containerPivotOffset / (containerRef.current.clientWidth - 1);
  }, [cursorViewableOffset]);

  const zoom = useCallback((pivotX, amount) => {
    setChartInfo( oldChartInfo => {
      const newChartInfo = {...oldChartInfo};
      const previousWidth = oldChartInfo.containerWidth ? oldChartInfo.containerWidth : containerRef.current.clientWidth;
      const zoomIncrement = 0.001 * previousWidth;

      newChartInfo.containerWidth = previousWidth - (amount * zoomIncrement);
      newChartInfo.containerWidth = boundedZoom(newChartInfo);
      
      newChartInfo.zoomRatio = newChartInfo.containerWidth / chartRef.current.clientWidth;
      const widthIncrease = newChartInfo.containerWidth - previousWidth;
      const additionalLeftShiftAmount = 0 - eventContainerPivotRatio(pivotX, oldChartInfo.containerLeftOffset) * widthIncrease;
      newChartInfo.containerLeftOffset += additionalLeftShiftAmount;
      newChartInfo.containerLeftOffset = boundedLeftOffset(newChartInfo);
      return newChartInfo;
    });
  }, [eventContainerPivotRatio]);

  const pan = useCallback(clientX => {
    const panDistance = clientX - panStart;
    setChartInfo( oldPosition => {
      const newPosition = {...oldPosition};
      newPosition.containerLeftOffset += panDistance;
      newPosition.containerLeftOffset = boundedLeftOffset(newPosition);
      return newPosition;
    });
    setPanStart(clientX);
  }, [panStart]);

  const handleMouseDown = e => setPanStart(e.clientX);
  
  const handleMouseMove = e => {
    if(e.buttons !== 1) {
      return;
    }
    pan(e.clientX);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setDragging(true);
      setPanStart(e.touches[0].clientX);
    }
    else if (e.touches.length === 2) {
      setPinching(true);
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      setInitialPinchInfo({distance, centerX});
    }
  };

  const handleTouchMove = useCallback((e) => {
    console.log(e.touches[0])
    if (dragging && e.touches.length === 1) {
      pan(e.touches[0].clientX);
    }
    else if (pinching && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentPinchDistance = Math.sqrt(dx * dx + dy * dy);
      const zoomAmount = (initialPinchInfo.distance - currentPinchDistance) * pinchZoomSensitivity;
      zoom(initialPinchInfo.centerX, zoomAmount)
      setInitialPinchInfo(oldPinchInfo => ({...oldPinchInfo, distance: currentPinchDistance}));
    }
  }, [dragging, pinching, initialPinchInfo, pan, zoom]);

  const handleTouchEnd = useCallback(() => {
    setDragging(false);
    setPinching(false);
  }, []);

  const updateEvent = (event) => {  // TODO: future event modification support
    setChartEvents(chartEvents.map(oldEvent => oldEvent.id === event.id ? event : oldEvent));
  };

  useEffect(() => {
    const scrollPan = scrollAmount => {
      setChartInfo( oldChartInfo => {
        const newChartInfo = {...oldChartInfo};
        const panIncrement = 0.001 * chartRef.current.clientWidth;
        const panDistance = (scrollAmount * scrollPanSensitivity * panIncrement);
        newChartInfo.containerLeftOffset += panDistance;
        newChartInfo.containerLeftOffset = boundedLeftOffset(newChartInfo);
        return newChartInfo;
      });
    };
  
    // const scrollZoom = (cursorOffsetX, deltaY) => {
    //   zoom(cursorOffsetX, deltaY)
    // };

    const handleScroll = event => {
      event.stopPropagation();
      event.preventDefault();
      const altScrollPan = (theme.altScrollPan !== undefined) ? theme.altScrollPan : true;
      if(Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        scrollPan(-event.deltaX);
      }
      else if(event.altKey === altScrollPan){
        scrollPan(-event.deltaY);
        
      } else {
        const zoomAmount = event.deltaY * scrollZoomSensitivity;
        zoom(event.clientX, zoomAmount);
      }
    }
    
    const container = containerRef.current;
    container.addEventListener('wheel', handleScroll, {passive:false});
    container.addEventListener('mouseenter', disableBrowserBackBehavior, {passive:false});
    container.addEventListener('mouseleave', enableBrowserBackBehavior, {passive:false});
    return () => {
      container.removeEventListener('wheel', handleScroll);
      container.removeEventListener('mouseenter', disableBrowserBackBehavior);
      container.removeEventListener('mouseleave', enableBrowserBackBehavior);
    }
  }, [containerRef, theme.altScrollPan, zoom]);

  const boundZoomIfUpdated = () => {
    chartInfo.zoomRatioLimit = timeline.totalDays / (theme.zoomLimitDays ||timeline.shortestEventDays);
    if(chartInfo.zoomRatio > chartInfo.zoomRatioLimit){
      chartInfo.zoomRatio = chartInfo.zoomRatioLimit;
      handleResize();
    }
  };

  let timelineRows = [];
  [timelineRows, timeline] = getTimelineRows(chartEvents);  // updating both variables in one pass through events
  boundZoomIfUpdated();  // update the zoom after we have the updated timeline
  
  const setRowsHeight = () => {
    setChartInfo( oldPosition => {
      const newPosition = {...oldPosition};
        newPosition.chartHeight = rowRef.current && rowRef.current.clientHeight;
      return newPosition;
    });
  };


  const setInitialChartInfo = () => {
    setChartInfo( oldPosition => {
      const newPosition = {...oldPosition};
      newPosition.chartWidth = chartRef.current.clientWidth;
      newPosition.containerWidth = chartRef.current.clientWidth;
      newPosition.containerLeftOffset = 0;
      newPosition.zoomRatio = 1;
      return newPosition;
    });
  };

  useEffect(() => {
    setInitialChartInfo();
    setChartEvents([...events]);
  }, [rowRef, containerRef, events]);  // if we update the dataset, reset the chart

  useLayoutEffect(() => {
    setRowsHeight();
  }, [theme, chartEvents]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    window.addEventListener('scroll', () => setDragging(false));
    return () => {
      window.removeEventListener("resize", handleResize);
    }
  }, []);
  
  return (
      <div
        ref={chartRef}
      >
        <Container
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          theme={theme}
          style={{
            width: `${chartInfo.containerWidth}px`,
            transform: `translateX(${chartInfo.containerLeftOffset}px)`
          }}
        >
          <div ref={rowRef}>
            {timelineRows.map((events, index) => (
              <Row
                key={index}
                events={events}
                updateEvent={updateEvent}
                timeline={timeline}
                swimlaneRow={(index % 2 && swimlanes)}
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
