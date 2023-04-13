import React, { useState } from "react";
import sampleEvents from "./exampleData";
import Timeline from "./Timeline"
import CodeBox from "./CodeBox"
import styled from 'styled-components';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
  margin: 64px 10% 64px 10%;
`

const Select = styled.select`
  height: 64px;
  font-size: 20px;
  padding: 8px;
  width: 50%;
`

const themes = {
  "4. Slate": {
    showChartBorder: false,
    chartBorderColor: '#64748b',
    chartBorderRadius: '0px',
    chartBackgroundColor: '#cbd5e1',
    showEventBoxShadow: false,
    eventColor: '#0f172a',
    eventTextColor: '#f1f5f9',
    eventBorderColor: 'gray',
    eventBorderRadius: '0',
    tickTextColor: '#020617',
    tickColor: '#64748b',
    showBars: true,
    showSwimlanes: true,
    swimlaneColor: '#94a3b8',
    showEventBorder: false,
    panOnScroll: false,
    tickCount: 11,
  },

  "6. Bubble": {
    showChartBorder: false,
    chartBorderColor: '#7e22ce',
    chartBorderRadius: '32px',

    chartBackgroundColor: '#a855f7',

    eventColor: '#fcd34d',
    
    eventTextColor: '#1c1917',
    eventBorderColor: 'gray',
    eventBorderRadius: '24px',
    showEventBoxShadow: false,
    tickTextColor: '#f5f5f5',
    tickColor: '#f5f5f5',
    showBars: false,
    showSwimlanes: false,

    swimlaneColor: '#7e22ce',

    showEventBorder: false,
    panOnScroll: false,
    tickCount: 5,
  },

  "2. secureframe": {
    showChartBorder: false,
    chartBorderColor: '#7e22ce',
    chartBorderRadius: '8px',

    chartBackgroundColor: '#1e294d',
    // chartBackgroundColor: '#177EE5',

    eventColor: '#1061c4',
    // eventColor: '#5656BF',
    
    eventTextColor: '#f1f5f9',
    showEventBorder: false,
    eventBorderColor: '#475569',
    eventBorderRadius: '4px',
    showEventBoxShadow: true,
    tickTextColor: '#f5f5f5',
    tickColor: '#94a3b8',
    showBars: false,
    showSwimlanes: true,

    swimlaneColor: '#174589',

    panOnScroll: false,
    tickCount: 8,
  },

  "5. Wireframe": {
    showChartBorder: true,
    chartBorderColor: '#020617',
    chartBorderRadius: '8px',

    chartBackgroundColor: '#f8fafc',
    // chartBackgroundColor: '#177EE5',

    eventColor: '#f8fafc',
    // eventColor: '#5656BF',
    
    eventTextColor: '#020617',
    showEventBorder: true,
    eventBorderColor: '#020617',
    eventBorderRadius: '4px',
    showEventBoxShadow: false,
    tickTextColor: '#020617',
    tickColor: '#94a3b8',
    showBars: true,
    showSwimlanes: false,

    swimlaneColor: '#174589',

    panOnScroll: false,
    tickCount: 8,
  },

  "1. Ghost": {
    showChartBorder: false,
    chartBorderColor: '#020617',
    chartBorderRadius: '8px',

    chartBackgroundColor: '#ffffff',
    // chartBackgroundColor: '#177EE5',

    eventColor: '#ffffff',
    // eventColor: '#5656BF',
    
    eventTextColor: '#020617',
    showEventBorder: false,
    eventBorderColor: '#020617',
    eventBorderRadius: '4px',
    showEventBoxShadow: true,
    tickTextColor: '#020617',
    tickColor: '#94a3b8',
    showBars: false,
    showSwimlanes: false,

    swimlaneColor: '#174589',

    panOnScroll: false,
    tickCount: 8,
  },

  // GPT Generated Themes
  "3. Dark Mode": {
    showChartBorder: true,
    chartBorderColor: '#3a3a3a',
    chartBorderRadius: '8px',
    chartBackgroundColor: '#1a1a1a',
    showEventBoxShadow: true,
    eventColor: '#5a5a5a',
    eventTextColor: '#f1f5f9',
    eventBorderColor: 'gray',
    eventBorderRadius: '4px',
    tickTextColor: '#f5f5f5',
    tickColor: '#3a3a3a',
    showBars: true,
    showSwimlanes: true,
    swimlaneColor: '#2a2a2a',
    showEventBorder: false,
    panOnScroll: false,
    tickCount: 8,
  },

  "8. Forest": {
    showChartBorder: false,
    chartBorderColor: '#214a23',
    chartBorderRadius: '8px',
    chartBackgroundColor: '#88c7a2',
    showEventBoxShadow: false,
    eventColor: '#3c6f3d',
    eventTextColor: '#f1f5f9',
    eventBorderColor: 'gray',
    eventBorderRadius: '4px',
    tickTextColor: '#1c1c1c',
    tickColor: '#214a23',
    showBars: true,
    showSwimlanes: false,
    swimlaneColor: '#88c7a2',
    showEventBorder: false,
    panOnScroll: false,
    tickCount: 8,
  },

  "9. Sunset": {
    showChartBorder: false,
    chartBorderColor: '#e8743b',
    chartBorderRadius: '8px',
    chartBackgroundColor: '#f7c746',
    showEventBoxShadow: false,
    eventColor: '#f35e5c',
    eventTextColor: '#1c1c1c',
    eventBorderColor: 'gray',
    eventBorderRadius: '4px',
    tickTextColor: '#f5f5f5',
    tickColor: '#e8743b',
    showBars: true,
    showSwimlanes: false,
    swimlaneColor: '#f7c746',
    showEventBorder: false,
    panOnScroll: false,
    tickCount: 8,
  },

  "10. Ocean": {
    showChartBorder: false,
    chartBorderColor: '#0f3d5c',
    chartBorderRadius: '8px',
    chartBackgroundColor: '#3282b8',
    showEventBoxShadow: false,
    eventColor: '#1d4e89',
    eventTextColor: '#f1f5f9',
    eventBorderColor: 'gray',
    eventBorderRadius: '4px',
    tickTextColor: '#f5f5f5',
    tickColor: '#0f3d5c',
    showBars: true,
    showSwimlanes: true,
    swimlaneColor: '#5c5d5d',
    showEventBorder: false,
    panOnScroll: false,
    tickCount: 8,
  },

  "7. Minimalist": {
    showChartBorder: true,
    chartBorderColor: '#d1d5db',
    chartBorderRadius: '8px',
    chartBackgroundColor: '#ffffff',
    showEventBoxShadow: false,
    eventColor: '#f1f5f9',
    eventTextColor: '#1c1c1c',
    eventBorderRadius: '4px',
    tickTextColor: '#1c1c1c',
    tickColor: '#d1d5db',
    showBars: false,
    showSwimlanes: false,
    swimlaneColor: '#f1f5f9',
    showEventBorder: true,
    eventBorderColor: '#d1d5db',
    panOnScroll: false,
    tickCount: 9,
  },
}

function App() {
  const [events, setEvents] = useState(sampleEvents);
  console.log(Object.keys(themes))
  const sortedThemeNames = Object.keys(themes).sort((a, b) => (a.match(/[0-9]+/)[0] - b.match(/[0-9]+/)[0]))
  console.log(sortedThemeNames)
  const firstTheme = sortedThemeNames[0]
  console.log(firstTheme)
  const [themeSetting, setTheme] = useState({name: firstTheme, theme:themes[firstTheme]});

  return (
    <Page>
      <Select onChange={event => setTheme({name: event.target.value, theme: themes[event.target.value]})}>
        {sortedThemeNames.map(themeName => (
          <option key={themeName} value={themeName}>{themeName}</option>
        ))}
      </Select>
      <Timeline
        events={events}
        setEvents={setEvents}
        theme={themeSetting.theme}
      />
      <CodeBox
        keyName={themeSetting.name} theme={themeSetting.theme}
      />
    </Page>
  );
}

export default App;
