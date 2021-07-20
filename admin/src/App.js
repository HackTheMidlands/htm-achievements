import { Admin, Resource, ListGuesser, Login } from "react-admin";

import LoginPage from "./pages/LoginPage";
import * as CoreDataProvider from "./CoreDataProvider";
import * as AuthProvider from "./AuthProvider";

const App = () => (
  <Admin dataProvider={CoreDataProvider} authProvider={AuthProvider} loginPage={LoginPage}>
    <Resource name="users" list={ListGuesser} />
  </Admin>
);

export default App;
