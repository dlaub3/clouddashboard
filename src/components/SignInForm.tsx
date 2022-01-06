import LoadingButton from "@mui/lab/LoadingButton";
import TextField from "@mui/material/TextField";
import React from "react";
import { OnLoginSubmit } from "../types";

export const SignInForm = (props: {
  onSubmit: OnLoginSubmit;
  isSubmitting: boolean;
}) => {
  /* TODO: Handle Error/Validation Daniel Laubacher  Wed 05 Jan 2022 **/
  const isError = false;
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = () => {
    props.onSubmit({ username, password });
  };
  return (
    <>
      <TextField
        label="Username"
        defaultValue=""
        variant="filled"
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        defaultValue=""
        variant="filled"
        onChange={(e) => setPassword(e.target.value)}
      />
      <LoadingButton
        loading={props.isSubmitting}
        disabled={isError}
        onClick={handleSubmit}
      >
        Login
      </LoadingButton>
    </>
  );
};
