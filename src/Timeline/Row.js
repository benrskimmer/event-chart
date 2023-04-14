import Event from "./Event";
import styled from 'styled-components';

const Timeline = styled.div`
  position: relative;
  height: ${props => props.theme.showEventBorder ? '50px' : '48px'};
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: ${props => 
    (props.swimlaneRow && (props.theme.showSwimlanes || props.theme.showSwimlanes === undefined) ? 
    (props.theme.swimlaneColor || '#e2e8f0') : '')
  };
`

export default function Row ({events, updateEvent, timeline, swimlaneRow, theme}) {
  return(
    <Timeline
      swimlaneRow={swimlaneRow}
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
