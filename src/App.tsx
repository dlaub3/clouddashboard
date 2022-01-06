import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { MenuPageLayout } from "./components/layout/MenuPageLayout";
import MenuBar from "./components/layout/MenuBar";
import { Authentication } from "./components/Authentication";
import { SignInForm } from "./components/SignInForm";
import { Table } from "./components/Table";

function App() {
  return (
    <Authentication
      unauthenticatedPage={({ onSubmit, isSubmitting }) => (
        <MenuPageLayout menu={<MenuBar isAuthenticated={false} />}>
          <SignInForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
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
          <>
            <Table user={user} />
          </>
        </MenuPageLayout>
      )}
    />
  );
}

export default App;
