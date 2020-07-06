import {
  Box,
  Button,
  Dialog,
  FormField,
  Heading,
  Input,
  InputSynced,
  Loader,
  Switch,
  Text,
  useGlobalConfig,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';
import getJsonWebToken from './getJsonWebToken';

function Credentials({usernameInState, setUsernameInState, setJsonWebToken}) {
  // get info from GlobalConfig
  const globalConfig = useGlobalConfig();
  const canSaveToGlobalConfig = globalConfig.checkPermissionsForSet().hasPermission;
  const wordPressDomain = globalConfig.get("wordPressDomain");
  const usernameInGlobalConfig = globalConfig.get("username");
  const passwordInGlobalConfig = globalConfig.get("password");
  // credentials stored in state
  const [passwordInState, setPasswordInState] = useState("");
  // fetch status stored in state
  const [fetchStatus, setFetchStatus] = useState("notAttempted");


  const callbackFromGetJWT = (result) => {
    if (result.success) {
      setJsonWebToken(result.token)
      setFetchStatus("success")
    } else {
      setJsonWebToken(null)
      setFetchStatus("failed")
    }
  }


  if (fetchStatus == "fetching") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border="default"
        backgroundColor="white"
        padding="20px"
        width="100vw"
        height="100vh"
        overflow="hidden"
      >
        <Text textAlign="center">Logging in to</Text>
        <Text textAlign="center">{wordPressDomain}</Text>
        <Text textAlign="center">as {usernameInState}</Text>
        <br />
        <Loader scale={0.3} />
      </Box>
    )
  }


  if (fetchStatus == "failed") {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        border="default"
        backgroundColor="white"
        padding="20px"
        width="100vw"
        height="100vh"
        overflow="hidden"
      >
        <Text textAlign="center">
          Unable to login to <br/>
          <strong>{wordPressDomain}</strong><br/>
          as <strong>{usernameInState}</strong>
        </Text><br />
        <Text textAlign="center">
          Make sure your username and password match a user for the WordPress site.
        </Text><br />
        <Text textAlign="center">
          The WordPress site might also need to have the <a target="_blank"
          href="https://wordpress.org/plugins/jwt-authentication-for-wp-rest-api/">JWT Authentication for WP-API</a> Plugin
          setup.
        </Text><br />
        <Button
          variant="primary"
          onClick={() => {setFetchStatus("notAttempted")}}
        >
        Dismiss
        </Button>
      </Box>
    )
  }

  return (
    <div style={{padding: '15px', 'height': '100vh'}}>
      <Heading  textAlign="center">Login to your WordPress website</Heading>
      <Text  textAlign="center">{wordPressDomain}</Text>
      <hr style={{height:'2px', color:'gray'}} />
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding="5px"
        >
          <Button
            variant="primary"
            disabled={!usernameInGlobalConfig || !passwordInGlobalConfig}
            onClick={() => {
              setFetchStatus("fetching")
              getJsonWebToken(wordPressDomain, usernameInGlobalConfig, passwordInGlobalConfig, callbackFromGetJWT)
            }}
          >
          Login as saved user
          </Button>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          borderLeft="thick"
          borderRadius="0"
          height="100%"
          width="100%"
          padding="15px"
          margin="15px"
        >
          <FormField label="Username">
            <Input
              value={usernameInState}
              onChange={e => setUsernameInState(e.target.value)}
            />
          </FormField>
          <FormField label="Password">
            <input
              type="password"
              value={passwordInState}
              onChange={e => setPasswordInState(e.target.value)}
            />
          </FormField>
          <Button
            variant="primary"
            disabled={!canSaveToGlobalConfig}
            onClick={() => {
              globalConfig.setAsync("username", usernameInState)
              globalConfig.setAsync("password", passwordInState)
            }}
          >
          Save credentials for all users
          </Button>
          <Button
            variant="primary"
            marginY="15px"
            disabled={!usernameInState || !passwordInState || !wordPressDomain}
            onClick={() => {
              setFetchStatus("fetching")
              getJsonWebToken(wordPressDomain, usernameInState, passwordInState, callbackFromGetJWT)
            }}
          >
          Login
          </Button>
        </Box>
      </Box>
    </div>
  );
}


export default Credentials;
