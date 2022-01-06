import { Auth } from "aws-amplify";
import React from "react";
import { OnLoginSubmit, OnSignOut, User } from "../types";

export const Authentication = (props: {
  unauthenticatedPage: (props_: {
    onSubmit: OnLoginSubmit;
    isSubmitting: boolean;
  }) => JSX.Element;
  authenticatedPage: (props_: {
    user: User;
    onSignOut: OnSignOut;
  }) => JSX.Element;
}) => {
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
    } catch (error) {
      /* TODO: Handle error Daniel Laubacher  Wed 05 Jan 2022 **/
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
    : props.unauthenticatedPage({ onSubmit: onLogin, isSubmitting });
};
