import { Admin, Resource } from "react-admin";

import LoginPage from "./pages/LoginPage";
import * as CoreDataProvider from "./CoreDataProvider";
import * as AuthProvider from "./AuthProvider";

import * as Users from "./components/Users";
import * as Achievements from "./components/Achievements";

const App = () => (
  <Admin
    dataProvider={CoreDataProvider}
    authProvider={AuthProvider}
    loginPage={LoginPage}
  >
    <Resource
      name="users"
      show={Users.UserShow}
      list={Users.UserList}
      create={Users.UserCreate}
      edit={Users.UserEdit}
    />
    <Resource
      name="achievements"
      show={Achievements.AchievementShow}
      list={Achievements.AchievementList}
    />
  </Admin>
);

export default App;
