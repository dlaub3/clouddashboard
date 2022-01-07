import { Auth } from "aws-amplify";
import React from "react";
import { OnLoginSubmit, OnChangePassword, OnSignOut, User } from "../types";
import awsExports from "./../aws-exports";
import { Amplify } from "aws-amplify";
import CircularIndeterminate from "./loaders/CircularIndeterminate";

Amplify.configure(awsExports);

interface AuthData {
  isAuthenticated: boolean;
  user: User | null;
}

const isAuthOK = (x: AuthData): x is { isAuthenticated: true; user: User } => {
  return x.isAuthenticated && x.user !== null;
};

const isNotAuthorizedException = (
  x: unknown
): x is { __type: "NotAuthorizedException"; message: string } =>
  x !== null &&
  typeof x === "object" &&
  "__type" in x &&
  "message" in x &&
  (x as { __type?: string }).__type === "NotAuthorizeException";

export enum LoginFlow {
  LOGIN = "LOGIN",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
}

export const Authentication = (props: {
  unauthenticatedPage: (props_: {
    loginFlow: LoginFlow;
    errorMsg: string;
    onSubmit: OnLoginSubmit;
    isSubmitting: boolean;
    onChangePassword: OnChangePassword;
  }) => JSX.Element;
  authenticatedPage: (props_: {
    user: User;
    onSignOut: OnSignOut;
  }) => JSX.Element;
}) => {
  const [loginFlow, setLoginFlow] = React.useState(LoginFlow.LOGIN);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [authData, setAuthData] = React.useState<AuthData>({
    isAuthenticated: false,
    user: null,
  });

  const onChangePassword = async (props_: { password: string }) => {
    setIsSubmitting(true);

    try {
      await Auth.completeNewPassword(authData.user, props_.password, []);
      setAuthData((auth) => ({ isAuthenticated: true, user: auth.user }));
    } catch (error: unknown | { __type: string; message: string }) {
      /* TODO: Improve error handling Daniel Laubacher  Wed 05 Jan 2022 **/
      setErrorMsg("An unknown error occured. Please try again.");
      console.log("error changing password:", error);
    }
    setIsSubmitting(false);
    setLoginFlow(LoginFlow.LOGIN);
  };

  const onLogin = async (props_: { username: string; password: string }) => {
    setIsSubmitting(true);

    try {
      const user = await Auth.signIn(props_.username, props_.password);
      if (user.challengeName === "NEW_PASSWORD_REQUIRED") {
        setLoginFlow(LoginFlow.CHANGE_PASSWORD);
        setAuthData({ isAuthenticated: false, user });
      } else {
        setAuthData({ isAuthenticated: true, user });
      }
    } catch (error: unknown | { __type: string; message: string }) {
      /* TODO: Improve error handling Daniel Laubacher  Wed 05 Jan 2022 **/
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

      console.log("error signing in:", error);
    }
    setIsSubmitting(false);
  };

  const onSignOut = async () => {
    try {
      await Auth.signOut();
      setAuthData({ isAuthenticated: false, user: null });
    } catch (error) {
      /* TODO: Improve error handling Daniel Laubacher  Wed 05 Jan 2022 **/
      console.log("error signing out: ", error);
    }
  };

  const checkSession = async () => {
    setIsLoading(true);
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
      /* TODO: Improve error handling Daniel Laubacher  Wed 05 Jan 2022 **/
      console.log("error getting session info: ", error);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    checkSession();
  }, []);

  return isLoading ? (
    <CircularIndeterminate />
  ) : isAuthOK(authData) ? (
    props.authenticatedPage({ ...authData, onSignOut })
  ) : (
    props.unauthenticatedPage({
      onSubmit: onLogin,
      isSubmitting,
      errorMsg,
      loginFlow,
      onChangePassword,
    })
  );
};
