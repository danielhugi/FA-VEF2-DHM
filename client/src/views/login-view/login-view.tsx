import { Box, Button, FormControl, Text, FormLabel, Heading, Input, FormErrorMessage, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { loginContainer } from "./style.css";
import { themeVars } from "../../themes/theme.css";
import { useNavigate } from "react-router-dom";
import { authenticateUser } from "../../services/user-service";

export function LoginView() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [failedMessage, setFailedMessage] = useState<string>("");
  const navigate = useNavigate();
  async function submitForm() {
      setFailedMessage("");
      const user = await authenticateUser(username, password);
      if (user) {
          navigate("/dashboard");
      } else {
          setFailedMessage("Authentication failed.");
      }
  }
  const isUsernameError = username.length <= 3;
  const isPasswordError = password.length === 3;
  return (
    <Box className={loginContainer}>
        <Heading>Login</Heading>
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
                <Button onClick={() => submitForm()}>Login</Button>
                <Button onClick={() => navigate("/register")}>Register</Button>
            </Stack>
            <Text color={themeVars.colors.red}>{failedMessage}</Text>
        </form>
    </Box>
  )
}