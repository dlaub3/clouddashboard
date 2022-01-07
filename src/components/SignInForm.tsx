/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import React from "react";
import { OnChangePassword, OnLoginSubmit } from "../types";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { css } from "@mui/material/styles";
import { LoginFlow } from "./Authentication";

export const SignInForm = (props: {
  errorMsg: string;
  onSubmit: OnLoginSubmit;
  isSubmitting: boolean;
  onChangePassword: OnChangePassword;
  loginFlow: LoginFlow;
}) => {
  /* TODO: improve validation errors Daniel Laubacher  Wed 05 Jan 2022 **/
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = () => {
    if (props.loginFlow === LoginFlow.LOGIN) {
      props.onSubmit({ username, password });
    }
    if (props.loginFlow === LoginFlow.CHANGE_PASSWORD) {
      props.onChangePassword({ password });
    }
  };

  return (
    <Box
      flex={1}
      flexBasis={"100%"}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper sx={{ p: 8, width: 550 }} elevation={3}>
        <Box display="flex" flexDirection="column">
          {props.errorMsg && <Alert severity="error">{props.errorMsg}</Alert>}
          {props.loginFlow === LoginFlow.CHANGE_PASSWORD && (
            <Alert severity="info">You must enter a new password.</Alert>
          )}
          <form
            css={css`
              display: flex;
              flex-direction: column;
            `}
          >
            {props.loginFlow === LoginFlow.LOGIN && (
              <TextField
                label="Username"
                defaultValue=""
                variant="filled"
                onChange={(e) => setUsername(e.target.value)}
                sx={{ mt: 6 }}
                required
              />
            )}
            <TextField
              type="password"
              label="Password"
              defaultValue=""
              variant="filled"
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mt: 6 }}
              required
            />
            <LoadingButton
              sx={{ mt: 6 }}
              type="submit"
              variant="contained"
              loading={props.isSubmitting}
              onClick={handleSubmit}
            >
              Login
            </LoadingButton>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};
