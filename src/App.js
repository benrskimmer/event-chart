import React, { useState } from "react";
import sampleEvents from "./exampleData";
import themes from "./sampleThemes";
import Timeline from "./Timeline/Timeline";
import CodeBox from "./CodeBox";
import styled from 'styled-components';

const Page = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
  margin: 64px 10% 64px 10%;
`

const ContentSelectors = styled.div`
  display: flex;
  flex-direction: row;
  gap: 64px;
`

const Select = styled.select`
  height: 48px;
  font-size: 20px;
  padding: 8px;
  width: 50%;
`

const getNumber = s => s.match(/[0-9]+/)[0];

function App() {
  const sortedDatasetNames = Object.keys(sampleEvents).sort((a, b) => (getNumber(a) - getNumber(b)));
  const firstDatasetName = sortedDatasetNames[0];
  const [events, setEvents] = useState(sampleEvents[firstDatasetName]);
  const sortedThemeNames = Object.keys(themes).sort((a, b) => (getNumber(a) - getNumber(b)));
  const firstThemeName = sortedThemeNames[0];
  const [themeSetting, setTheme] = useState({name: firstThemeName, theme:themes[firstThemeName]});

  const updateTheme = onChangeEvent => {
    setTheme({name: onChangeEvent.target.value, theme: themes[onChangeEvent.target.value]});
  };

  const updateDataset = onChangeEvent => {
    setEvents(sampleEvents[onChangeEvent.target.value]);
  };

  return (
    <Page>
      <ContentSelectors>
        <Select onChange={updateTheme}>
          {sortedThemeNames.map(themeName => (
            <option key={themeName} value={themeName}>{themeName}</option>
          ))}
        </Select>
        <Select onChange={updateDataset}>
          {sortedDatasetNames.map(datasetName => (
            <option key={datasetName} value={datasetName}>{datasetName}</option>
          ))}
        </Select>
      </ContentSelectors>
      <Timeline
        events={events}
        saveChartEventsHook={setEvents}
        theme={themeSetting.theme}
      />
      <CodeBox
        keyName={themeSetting.name} theme={themeSetting.theme}
      />
    </Page>
  );
}

export default App;
