/* eslint-disable react/react-in-jsx-scope -- Unaware of jsxImportSource */
/** @jsxImportSource @emotion/react */
import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import React from "react";
import { OnLoginSubmit } from "../types";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { css } from "@mui/material/styles";

export const SignInForm = (props: {
  errorMsg: string;
  onSubmit: OnLoginSubmit;
  isSubmitting: boolean;
}) => {
  /* TODO: Handle Error/Validation Daniel Laubacher  Wed 05 Jan 2022 **/
  const isError = props.errorMsg !== "";
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = () => {
    props.onSubmit({ username, password });
  };

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Paper sx={{ p: 8, width: 550 }} elevation={3}>
        <Box display="flex" flexDirection="column">
          {props.errorMsg && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {props.errorMsg}
            </Alert>
          )}
          <form
            css={css`
              display: flex;
              flex-direction: column;
            `}
          >
            <TextField
              label="Username"
              defaultValue=""
              variant="filled"
              onChange={(e) => setUsername(e.target.value)}
              sx={{ mb: 6, mt: 6 }}
              required
            />
            <TextField
              type="password"
              label="Password"
              defaultValue=""
              variant="filled"
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 6 }}
              required
            />
            <LoadingButton
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
