import { Box, Button, FormControl, Text, FormLabel, Heading, Input, FormErrorMessage, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { loginContainer } from "./styles.css";
import { themeVars } from "../../themes/theme.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/user-service";

export function RegisterView() {
  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [failedMessage, setFailedMessage] = useState<string>("");
  const navigate = useNavigate();
  async function submitForm() {
      setFailedMessage("");
      const user = await registerUser(username, displayName, password);
      if (user) {
          navigate("/");
      } else {
          setFailedMessage("Registration failed.");
      }
  }
  const isUsernameError = username.length <= 3;
  const isDisplayNameError = displayName.length <= 3;
  const isPasswordError = password.length <= 3;
  return (
    <Box className={loginContainer}>
        <Heading>Register</Heading>
        <form>
            <FormControl isInvalid={isUsernameError}>
              <FormLabel>Username</FormLabel> 
              <Input 
                id='username-input' 
                type='text' 
                value={username} 
                onChange={(evt) => setUsername(evt.target.value)} 
              />
              {isUsernameError && (
                <FormErrorMessage>Username must be provided.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={isDisplayNameError}>
              <FormLabel>Display Name</FormLabel> 
              <Input 
                id='displayname-input' 
                type='text' 
                value={displayName} 
                onChange={(evt) => setDisplayName(evt.target.value)} 
              />
              {isDisplayNameError && (
                <FormErrorMessage>Display Name must be provided.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={isPasswordError}>
                <FormLabel>Password</FormLabel> 
                <Input 
                  id='password-input' 
                  type='password' 
                  value={password} 
                  onChange={(evt) => setPassword(evt.target.value)} 
                />
                {isPasswordError && (
                  <FormErrorMessage>Password must be provided.</FormErrorMessage>
                )}
            </FormControl>
            <Stack direction="row" spacing={4} marginTop={5} marginBottom={5}>
                <Button onClick={() => submitForm()}>Register</Button>
                <Button onClick={() => navigate("/")}>Cancel</Button>
            </Stack>
            <Text color={themeVars.colors.red}>{failedMessage}</Text>
        </form>
    </Box>
  )
}