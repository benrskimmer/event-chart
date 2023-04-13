import Event from "./Event";
import styled from 'styled-components';

const Timeline = styled.div`
  position: relative;
  height: ${props => props.theme.showEventBorder ? '50px' : '48px'};
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: ${props => (props.swimlaneOn && props.theme.showSwimlanes ? props.theme.swimlaneColor : '')}
`

export default function Row ({events, updateEvent, timeline, swimlaneOn, theme}) {
  return(
    <Timeline
      swimlaneOn={swimlaneOn}
      theme={theme}
    >
      {events.map((event) => (
        <Event
          key={event.id}
          event={event}
          updateEvent={updateEvent}
          timeline={timeline}
          theme={theme}
        />
      ))}
    </Timeline>
  );
}
