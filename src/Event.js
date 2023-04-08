import "./App.css";
import { format, parseISO, differenceInDays } from "date-fns";

export default function Event ({event, timeline}) {
  const calculateEventWidth = (start, end) => {
    const eventDuration = differenceInDays(parseISO(end), parseISO(start));
    return (eventDuration / timeline.totalDays) * 100;
  };

  const calculateEventPosition = start => {
    const daysFromStart = differenceInDays(parseISO(start), timeline.startDate);
    return (daysFromStart / timeline.totalDays) * 100;
  };

  return(
    <div
      className="event"
      style={{
        width: `${calculateEventWidth(event.start, event.end)}%`,
        left: `${calculateEventPosition(event.start)}%`
      }}
    >
      <div className="event-container">
        <div className="event-name">{event.name}</div>
        <div className="event-dates">
          {format(parseISO(event.start), "MMM d, yyyy")} -{" "}
          {format(parseISO(event.end), "MMM d, yyyy")}
        </div>
      </div>
    </div>
  );
}
