import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { MenuPageLayout } from "./components/layout/MenuPageLayout";
import MenuBar from "./components/layout/MenuBar";
import { Authentication } from "./components/Authentication";
import { SignInForm } from "./components/SignInForm";
import { Table } from "./components/Table";
import { Paper } from "@mui/material";

function App() {
  return (
    <Authentication
      unauthenticatedPage={({ errorMsg, onSubmit, isSubmitting }) => (
        <MenuPageLayout menu={<MenuBar isAuthenticated={false} />}>
          <SignInForm
            errorMsg={errorMsg}
            onSubmit={onSubmit}
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
          <Table user={user} />
        </MenuPageLayout>
      )}
    />
  );
}

export default App;
