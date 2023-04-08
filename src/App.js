import React, { useState } from "react";
import "./App.css";
import sampleEvents from "./exampleData";
import Timeline from "./Timeline"

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
