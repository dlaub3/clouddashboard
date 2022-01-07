import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { MenuPageLayout } from "./components/layout/MenuPageLayout";
import MenuBar from "./components/layout/MenuBar";
import { Authentication } from "./components/Authentication";
import { SignInForm } from "./components/SignInForm";
import { Table } from "./components/Table";
import DefaultErrorBoundary from "./components/DefaultErrorBoundry";
import Box from "@mui/material/Box";

function App() {
  return (
    <DefaultErrorBoundary>
      <Authentication
        unauthenticatedPage={({
          loginFlow,
          errorMsg,
          onSubmit,
          onChangePassword,
          isSubmitting,
        }) => (
          <MenuPageLayout menu={<MenuBar isAuthenticated={false} />}>
            <SignInForm
              loginFlow={loginFlow}
              errorMsg={errorMsg}
              onSubmit={onSubmit}
              onChangePassword={onChangePassword}
              isSubmitting={isSubmitting}
            />
          </MenuPageLayout>
        )}
        authenticatedPage={({ user, onSignOut }) => (
          <MenuPageLayout
            menu={
              <MenuBar
                username={user.username}
                isAuthenticated={true}
                logout={onSignOut}
              />
            }
          >
            <Box pt="1.5em" pb="2em">
              <Table user={user} />
            </Box>
          </MenuPageLayout>
        )}
      />
    </DefaultErrorBoundary>
  );
}

export default App;
