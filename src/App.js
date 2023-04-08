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

const sampleEvents = [
  {
    name: "Winter Break",
    start: "2023-01-01",
    end: "2023-02-28"
  },
  {
    name: "Art Festival",
    start: "2023-02-14",
    end: "2023-04-30"
  },
  {
    name: "Science Symposium",
    start: "2023-03-20",
    end: "2023-06-01"
  },
  {
    name: "Music Festival",
    start: "2023-04-15",
    end: "2023-07-01"
  },
  {
    name: "Spring Break",
    start: "2023-04-15",
    end: "2023-06-30"
  },
  {
    name: "Nature Expedition",
    start: "2023-05-10",
    end: "2023-07-31"
  },
  {
    name: "Film Festival",
    start: "2023-05-25",
    end: "2023-08-10"
  },
  {
    name: "Creative Workshop",
    start: "2023-06-01",
    end: "2023-08-31"
  },
  {
    name: "Earth Day Celebration",
    start: "2023-07-01",
    end: "2023-09-30"
  },
  {
    name: "Summer Camp",
    start: "2023-07-05",
    end: "2023-09-30"
  },
  {
    name: "Harvest Festival",
    start: "2023-07-20",
    end: "2023-11-01"
  },
  {
    name: "International Day",
    start: "2023-08-10",
    end: "2023-11-30"
  },
  {
    name: "Hiking Adventure",
    start: "2023-08-20",
    end: "2023-12-31"
  },
  {
    name: "Independence Day Celebration",
    start: "2023-09-10",
    end: "2023-12-31"
  },
  {
    name: "Summer Break",
    start: "2023-09-25",
    end: "2024-02-29"
  },
  {
    name: "Beach Vacation",
    start: "2023-10-01",
    end: "2024-02-29"
  },
  {
    name: "International Music Day",
    start: "2023-11-01",
    end: "2024-01-31"
  },
  {
    name: "Summer Olympics",
    start: "2023-11-20",
    end: "2024-03-31"
  },
  {
    name: "Labor Day Weekend",
    start: "2023-12-15",
    end: "2024-05-31"
  }
];

// const sampleEvents = [
//   {
//     name: "Event A",
//     start: "2022-03-03",
//     end: "2022-03-25"
//   },
//   {
//     name: "Event B",
//     start: "2022-01-03",
//     end: "2022-01-25"
//   },
//   {
//     name: "Event C",
//     start: "2022-02-10",
//     end: "2022-03-15"
//   },
//   {
//     name: "Event D",
//     start: "2022-02-28",
//     end: "2022-03-28"
//   },
//   {
//     name: "Event E",
//     start: "2022-04-01",
//     end: "2022-04-25"
//   }
// ];

const Timeline = ({ events }) => {
  let startDate = "";
  let endDate = "";
  let totalDays = 0;
  // let rows = [[]];

  const calculateEventWidth = (start, end) => {
    const eventDuration = differenceInDays(parseISO(end), parseISO(start));
    return (eventDuration / totalDays) * 100;
  };

  const calculateEventPosition = start => {
    const daysFromStart = differenceInDays(parseISO(start), startDate);
    return (daysFromStart / totalDays) * 100;
  };

  // const getEventTimes = events => {
  //   let eventTimes = [];
  //   events.forEach(event => {
  //     eventTimes.push(
  //       {
  //         name: event.name,
  //         timestamp: event.start,
  //         type: "start"
  //       },
  //       {
  //         name: event.name,
  //         timestamp: event.end,
  //         type: "end"
  //       }
  //     );
  //   });
  //   eventTimes.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp));
  //   return eventTimes;
  // };

  const addEventToRows = (rows, event) => {
    for (const row of rows) {
      const lastEvent = row[row.length - 1];
      // console.log(row)
      if (event.start > lastEvent.end) {
        row.push(event);
        return
      }
    }
    rows.push([event])
  }

  const latestDate = (lastDate, date) => {
    return (Date.parse(date) > Date.parse(lastDate)) ? date : lastDate;
  }

  const createRows = events => {
    events.sort((a, b) => Date.parse(a.start) - Date.parse(b.start));
    // let eventTimes = getEventTimes(events);
    startDate = parseISO(events[0].start);
    let lastDate = events[0].end;
    let rows = [];
    events.forEach(event => {
      addEventToRows(rows, event);
      lastDate = latestDate(lastDate, event.end);
    });
    endDate = parseISO(lastDate);
    console.log(rows);
    totalDays = differenceInDays(endDate, startDate);
    console.log(startDate, endDate, totalDays);
    return rows;
  }

  const rows = createRows(events);

  return (
    <div className="chart">
      <div className="container">
        {rows.map((events, index) => (
          <div
            key={index}
            className="timeline"
          >
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


          
        ))}
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

