// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import { format, parseISO, differenceInDays } from "date-fns";
import "./App.css";

// const sampleEvents = [
//   {
//     name: "Event A",
//     start: "2022-01-01",
//     end: "2022-01-31"
//   },
//   {
//     name: "Event B",
//     start: "2022-02-05",
//     end: "2022-02-15"
//   },
//   {
//     name: "Event C",
//     start: "2022-02-20",
//     end: "2022-02-25"
//   },
//   {
//     name: "Event D",
//     start: "2022-03-01",
//     end: "2022-03-28"
//   },
//   {
//     name: "Event E",
//     start: "2022-04-01",
//     end: "2022-04-25"
//   }
// ];

const sampleEvents = [
  {
    name: "Event A",
    start: "2022-01-01",
    end: "2022-01-02"
  },
  {
    name: "Event B",
    start: "2022-01-03",
    end: "2022-01-04"
  },
  // {
  //   name: "Event C",
  //   start: "2022-02-20",
  //   end: "2022-02-25"
  // },
  // {
  //   name: "Event D",
  //   start: "2022-03-01",
  //   end: "2022-03-28"
  // },
  // {
  //   name: "Event E",
  //   start: "2022-04-01",
  //   end: "2022-04-25"
  // }
];

const Timeline = ({ events }) => {
  const startDate = parseISO(events[0].start);
  const endDate = parseISO(events[events.length - 1].end);
  const totalDays = differenceInDays(endDate, startDate);

  const calculateEventWidth = (start, end) => {
    const eventDuration = differenceInDays(parseISO(end), parseISO(start));
    return (eventDuration / totalDays) * 100;
  };

  const calculateEventPosition = start => {
    const daysFromStart = differenceInDays(parseISO(start), startDate);
    return (daysFromStart / totalDays) * 100;
  };

  return (
    <div className="chart">
      <div className="container">
        <div className="timeline">
          {events.map((event, index) => (
            <div
              key={index}
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
          ))}
        </div>
        <div className="timeline">
          {events.map((event, index) => (
            <div
              key={index}
              className="event"
              style={{
                width: `${calculateEventWidth(event.start, event.end)}%`,
                left: `${calculateEventPosition(event.start)}%`,
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
          ))}
        </div>

        <div className="tick-marks"></div>
      </div>
    </div>
  );
};

function App() {
  const [events, setEvents] = useState(sampleEvents);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Timeline Component</h1>
      </header>
      <Timeline events={events} />
    </div>
  );
}

export default App;

