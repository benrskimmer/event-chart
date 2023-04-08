import "./App.css";
import Event from "./Event";

export default function Row ({events, timeline}) {
  return(
    <div
      className="timeline"
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
