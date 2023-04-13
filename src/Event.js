import styled, { css } from 'styled-components';
import { format, parseISO, differenceInDays } from "date-fns";
import { useState } from 'react';

const EventContainer = styled.div`
  position: absolute;
  background-color: ${props => props.theme.eventColor};
  border-radius: ${props => props.theme.eventBorderRadius};
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.theme.showEventBoxShadow && css`
    box-shadow: 0 0px 8px rgba(0, 0, 0, 0.4);
  `}
  height: 48px;
  z-index: 3;
  left: ${props => props.left || 0}%;
  width: ${props => props.width || 0}%;
  ${props => props.theme.showEventBorder && css`
    border: 1.5px solid ${props => props.theme.eventBorderColor}
  `};  
`

const EventTextContainer = styled.div`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
`

const EventName = styled.h1`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
  font-size: 1rem;
  margin: 0;
  font-weight: bold;
  margin-bottom: 0.25rem;
  margin-top: 0;
  color: ${props => props.theme.eventTextColor};
`

const EventDates = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80%;
  font-size: 0.8rem;
  margin: 0;
  color: ${props => props.theme.eventTextColor};
`

const calculateEventPosition = (start, timeline) => {
  const daysFromStart = differenceInDays(parseISO(start), timeline.startDate);
  return (daysFromStart / timeline.totalDays) * 100;
};

const calculateEventWidth = (start, end, timeline) => {
  const eventDuration = differenceInDays(parseISO(end), parseISO(start));
  return (eventDuration / timeline.totalDays) * 100;
};

const mouseMoved = (oldMousePosition, mouseEvent, movementThreshold) => {
  const deltaX = Math.abs(oldMousePosition.x - mouseEvent.clientX);
  const deltaY = Math.abs(oldMousePosition.y - mouseEvent.clientY);
  return (deltaX <= movementThreshold && deltaY <= movementThreshold);
};

export default function Event ({event, updateEvent, timeline, theme}) {
  const [mousePosition, setMouseMoved] = useState({x: 0, y: 0});
  const movementThreshold = 4;  // not very accurate, varies by browser

  const handleMouseDown = mouseEvent => setMouseMoved({x: mouseEvent.clientX, y: mouseEvent.clientY});
  const handleMouseUp = mouseEvent => {
    if(mouseMoved(mousePosition, mouseEvent, movementThreshold)) {
      updateEvent({...event, ...{name: 'PARTAYYYYY'}});
    }
  };

  return(
    <EventContainer
      width={calculateEventWidth(event.start, event.end, timeline)}
      left={calculateEventPosition(event.start, timeline)}
      title={`${event.name}\n${event.start} - ${event.end}`}
      theme={theme}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <EventTextContainer>
        <EventName theme={theme}>{event.name}</EventName>
        <EventDates theme={theme}>
          {`${format(parseISO(event.start), "MMM d, yyyy")} -  ${format(parseISO(event.end), "MMM d, yyyy")}`}
        </EventDates>
      </EventTextContainer>
    </EventContainer>
  );
}
