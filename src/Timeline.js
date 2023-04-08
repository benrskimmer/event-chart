import "./App.css";
import { parseISO, differenceInDays } from "date-fns";
import Row from "./Row";

export default function Timeline ({ events }) {
  const timeline = {
    startDate: "",
    endDate: "",
    totalDays: 0
  }
  let maxZoomPercent = 0;

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

  const createRows = events => {
    let sortedEvents = events.map(a => ({...a}))  // ensure component is pure
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
    console.log(rows);
    timeline.totalDays = differenceInDays(timeline.endDate, timeline.startDate);
    maxZoomPercent = (timeline.totalDays / shortestEventDays) * 100;
    console.log(timeline.startDate, timeline.endDate, timeline.totalDays, maxZoomPercent);
    return rows;
  };

  const rows = createRows(events);
  
  return (
    <div className="chart">
      <div className="window">
        {rows.map((events, index) => (
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
