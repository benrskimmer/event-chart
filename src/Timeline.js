import "./App.css";
import Container from "./Container";

export default function Timeline ({ events, swimlanes=true }) {
  
  
  return (
    <div className="chart">
      <Container
        events={events}
        swimlanes={swimlanes}
      />
    </div>
  );
}
