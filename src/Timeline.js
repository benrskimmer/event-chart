import "./App.css";
import Container from "./Container";

export default function Timeline ({ events }) {
  
  
  return (
    <div className="chart">
      <Container events={events}/>
    </div>
  );
}
