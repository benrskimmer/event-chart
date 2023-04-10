import "./App.css";
import Event from "./Event";

export default function Row ({events, timeline, swimlaneOn}) {
  return(
    <div
      className="timeline"
      style={{
        backgroundColor: swimlaneOn ? '#5050502c' : ''
      }}
    >
      {events.map((event, index) => (
        <Event
          key={index}
          event={event}
          timeline={timeline}
        />
      ))}
    </div>
  );
}
