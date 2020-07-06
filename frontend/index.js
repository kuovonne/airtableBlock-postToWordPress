import {
  initializeBlock,
  useSettingsButton,
  ViewportConstraint,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';
import MainApp from './mainApp';
import BlockSettings, {validateSettings} from './blockSettings';

function App() {
  const settings = validateSettings();
  const [isShowingSettings, setIsShowingSettings] = useState(false);
  useSettingsButton(()=>setIsShowingSettings(!isShowingSettings));
  if (isShowingSettings) {
    return <BlockSettings setIsShowingSettings={setIsShowingSettings} />
  } else if (!settings) {
    return (
      <div style={{height: "100vh", display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div style={{width: "80%", display: "flex", flexDirection: "column", alignItems: "center"}}>
        <p style={{textAlign: "center"}}>
        This block creates and updates posts on a WordPress website.
        </p>
        <p>Please configure the settings to use this block.</p>
        </div>
      </div>
    )
  } else {
    return (
      <div>
      <ViewportConstraint minSize={{width: 450}} />
      <MainApp settings={settings} />
      </div>
    )
  }
}


initializeBlock(() => <App />);
