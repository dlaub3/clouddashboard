import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import { MenuPage } from "./components/layout/MenuPage";
import MenuBar from "./components/layout/MenuBar";
import { Authentication } from "./components/Authentication";
import { SignInForm } from "./components/SignInForm";
import { Table } from "./components/Table";

function App() {
  return (
    <Authentication
      unauthenticatedPage={({ onSubmit, isSubmitting }) => (
        <MenuPage menu={<MenuBar isAuthenticated={false} />}>
          <SignInForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
        </MenuPage>
      )}
      authenticatedPage={({ user, onSignOut }) => (
        <MenuPage menu={<MenuBar isAuthenticated={true} logout={onSignOut} />}>
          <>
            Welcome {(user as any).username}
            <Table user={user} />
          </>
        </MenuPage>
      )}
    />
  );
}

export default App;
