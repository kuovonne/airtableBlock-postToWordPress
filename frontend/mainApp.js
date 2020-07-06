import {
  Box,
  Text,
  TextButton,
  useGlobalConfig,
  useRecordById,
  useWatchable,
} from '@airtable/blocks/ui';
import {cursor} from '@airtable/blocks';
import React, {useState} from 'react';
import getJsonWebToken from './getJsonWebToken';
import Credentials from './credentials';
import RecordFinder from './recordFinder';

function MainApp({settings}) {
  // unpack the settings
  const wordPressDomain = settings.wordPressDomain;
  const [isShowingCredentials, setIsShowingCredentials] = useState(true);

  const [jsonWebToken, setJsonWebToken] = useState(null);
  // track username in globalConfig and state
  const globalConfig = useGlobalConfig();
  const usernameInGlobalConfig = globalConfig.get("username");
  const [usernameInState, setUsernameInState] = useState(usernameInGlobalConfig ? usernameInGlobalConfig : null);

  if (isShowingCredentials || !jsonWebToken) {
    return (
      <Credentials
        setIsShowingCredentials={setIsShowingCredentials}
        setJsonWebToken={setJsonWebToken}
        usernameInState={usernameInState}
        setUsernameInState={setUsernameInState}
      />
    )
  } else {
    return (
      <Box padding="5px">
        <Text textAlign="center">
        Logged into WordPress as <i>{usernameInState}</i> | <TextButton
          onClick={() => setIsShowingCredentials(true)}
        >
        Change</TextButton>
        </Text>
        <hr style={{height:'2px', color:'gray'}} />
        <RecordFinder settings={settings} jsonWebToken={jsonWebToken} />
      </Box>
    )
  }
}


export default MainApp;
