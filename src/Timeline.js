import "./App.css";
import Chart from "./Chart";

export default function Timeline ({ events, swimlanes=true }) {
  
  
  return (
    <div className="chart">
      <Chart
        events={events}
        swimlanes={swimlanes}
      />
    </div>
  );
}
