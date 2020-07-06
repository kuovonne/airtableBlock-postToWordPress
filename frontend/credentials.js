import {
  Box,
  Button,
  Dialog,
  FormField,
  Heading,
  Input,
  InputSynced,
  Loader,
  SwitchSynced,
  Text,
  useGlobalConfig,
} from '@airtable/blocks/ui';
import React, {useState} from 'react';
import getJsonWebToken from './getJsonWebToken';

function Credentials({setIsShowingCredentials, usernameInState, setUsernameInState, setJsonWebToken}) {
  // get info from GlobalConfig
  const globalConfig = useGlobalConfig();
  const canSaveToGlobalConfig = globalConfig.checkPermissionsForSet().hasPermission;
  const wordPressDomain = globalConfig.get("wordPressDomain");
  const isEnabledSaveUsername = globalConfig.get("isEnabledSaveUsername");
  const usernameInGlobalConfig = globalConfig.get("username");
  const isEnabledSavePassword = globalConfig.get("isEnabledSavePassword");
  const passwordInGlobalConfig = globalConfig.get("password");
  // credentials stored in state
  const [passwordInState, setPasswordInState] = useState("");
  // fetch status stored in state
  const [fetchStatus, setFetchStatus] = useState("notAttempted");

  const setUsername = (username) => {
    setUsernameInState(username)
    setFetchStatus("notAttempted")
    if (globalConfig.get("isEnabledSaveUsername") && canSaveToGlobalConfig) {
      globalConfig.setAsync("username", username)
    }
  }
  const clearUsernameInGlobalConfig = () => {
    globalConfig.setAsync("username", null)
  }
  const setPassword = (password) => {
    setPasswordInState(password)
    setFetchStatus("notAttempted")
    if (globalConfig.get("isEnabledSavePassword") && canSaveToGlobalConfig) {
      globalConfig.setAsync("password", password)
    }
  }
  const clearPasswordInGlobalConfig = () => {
    globalConfig.setAsync("password", null)
  }

  const SwitchSaveUsername = () => {
    return (
      <SwitchSynced
        globalConfigKey="isEnabledSaveUsername"
        label="save for all block users"
        backgroundColor="transparent"
        onChange={newValue => {
          if (newValue) {
            globalConfig.setAsync("username", usernameInState)
          } else {
            globalConfig.setAsync("username", null)
          }
        }}
      />
    )
  }


  const SwitchSavePassword = () => {
    return (
      <SwitchSynced
        globalConfigKey="isEnabledSavePassword"
        label="save for all block users"
        backgroundColor="transparent"
        onChange={newValue => {
          if (newValue) {
            globalConfig.setAsync("password", passwordInState)
          } else {
            globalConfig.setAsync("password", null)
          }
        }}
      />
    )
  }

  const ButtonLoginWithSavedCredentials = () => {
    return (
      <div>
        <Button
          variant="primary"
          disabled={!usernameInGlobalConfig || !passwordInGlobalConfig || !wordPressDomain}
          onClick={() => {
            setFetchStatus("fetching")
            getJsonWebToken(wordPressDomain, usernameInGlobalConfig, passwordInGlobalConfig, callbackFromGetJWT)
          }}
        >
        Login as {usernameInGlobalConfig}
        </Button>
        <hr style={{height:'2px', color:'gray'}} />
      </div>
    )
  }

  const callbackFromGetJWT = (result) => {
    if (result.success) {
      setJsonWebToken(result.token)
      setFetchStatus("success")
      setIsShowingCredentials(false)
    } else {
      setJsonWebToken(JSON.stringify(result))
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
      <Heading>Login to your WordPress website</Heading>
      <Text>{wordPressDomain}</Text>
      <hr style={{height:'2px', color:'gray'}} />
      {usernameInGlobalConfig && passwordInGlobalConfig ? <ButtonLoginWithSavedCredentials /> : ""}
      <FormField label="Username">
        <Input
          value={usernameInState}
          onChange={e => setUsername(e.target.value)}
        />
      {canSaveToGlobalConfig ? <SwitchSaveUsername /> : ""}
      </FormField>
      <hr style={{height:'2px', color:'gray'}} />
      <FormField label="Password">
        <input
          type="password"
          value={passwordInState}
          onChange={e => {
            setPassword(e.target.value)
          }}
        />
        {canSaveToGlobalConfig ? <SwitchSavePassword /> : ""}
      </FormField>
      <hr style={{height:'2px', color:'gray'}} />
      <Button
        variant="primary"
        disabled={!usernameInState || !passwordInState || !wordPressDomain}
        onClick={() => {
          setFetchStatus("fetching")
          getJsonWebToken(wordPressDomain, usernameInState, passwordInState, callbackFromGetJWT)
        }}
      >
      Login
      </Button>
    </div>
  );
}


export default Credentials;
