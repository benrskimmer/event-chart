import "./App.css";

export default function TickLine ({height}) {
  const tickHeight = 20;

  // const TickLine =

  return(
    <div className="bars"
      style={{
        top: `-${height}px`,
        height: `${tickHeight + height}px`
      }}
    >
    </div>
  );
}
