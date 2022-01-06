import { Auth } from "aws-amplify";
import React from "react";
import { OnLoginSubmit, OnSignOut, User } from "../types";
import awsExports from "./../aws-exports";
import { Amplify } from "aws-amplify";

Amplify.configure(awsExports);

const isNotAuthorizedException = (
  x: unknown
): x is { __type: "NotAuthorizedException"; message: string } =>
  x !== null &&
  typeof x === "object" &&
  "__type" in x &&
  "message" in x &&
  (x as { __type?: string }).__type === "NotAuthorizeException";

export const Authentication = (props: {
  unauthenticatedPage: (props_: {
    errorMsg: string;
    onSubmit: OnLoginSubmit;
    isSubmitting: boolean;
  }) => JSX.Element;
  authenticatedPage: (props_: {
    user: User;
    onSignOut: OnSignOut;
  }) => JSX.Element;
}) => {
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [authData, setAuthData] = React.useState<
    | { isAuthenticated: false; user: null }
    | { isAuthenticated: true; user: User }
  >({ isAuthenticated: false, user: null });

  const onLogin = async (props_: { username: string; password: string }) => {
    setIsSubmitting(true);

    try {
      const user = await Auth.signIn(props_.username, props_.password);
      setAuthData({ isAuthenticated: true, user });
    } catch (error: unknown | { __type: string; message: string }) {
      /* TODO: Handle error Daniel Laubacher  Wed 05 Jan 2022 **/
      if (error instanceof Error && error.name === "AuthError") {
        const { name, message } = error as any;
        if (name === "AuthError") {
          setErrorMsg(message);
        }
      } else if (isNotAuthorizedException(error)) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("An unknown error occured. Please try again.");
      }

      console.log("error signing in", error);
    }
    setIsSubmitting(false);
  };

  const onSignOut = async () => {
    try {
      await Auth.signOut();
      setAuthData({ isAuthenticated: false, user: null });
    } catch (error) {
      /* TODO: Handle error Daniel Laubacher  Wed 05 Jan 2022 **/
      console.log("error signing out: ", error);
    }
  };

  const checkSession = async () => {
    try {
      const session = await Auth.currentSession();
      if (session.isValid()) {
        try {
          const user = await Auth.currentUserPoolUser();
          setAuthData({ isAuthenticated: true, user });
        } catch (error) {
          throw error;
        }
      }
    } catch (error) {
      console.log("error getting session ifno: ", error);
    }
  };

  React.useEffect(() => {
    checkSession();
  }, []);

  return authData.isAuthenticated
    ? props.authenticatedPage({ ...authData, onSignOut })
    : props.unauthenticatedPage({ onSubmit: onLogin, isSubmitting, errorMsg });
};
