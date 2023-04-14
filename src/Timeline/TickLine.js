import styled from "styled-components";

const Bar = styled.div`
  position: absolute;
  z-index: 2;
  top: -${props => props.height}px;
  height: ${props => (props.tickHeight + props.height)}px;
  border-left: 2px solid ${props => props.theme.tickColor || 'black'};
`

export default function TickLine ({height, theme}) {
  const tickHeight = 20;
  return(
    <Bar
      tickHeight={tickHeight}
      height={height}
      theme={theme}
    />
  );
}
