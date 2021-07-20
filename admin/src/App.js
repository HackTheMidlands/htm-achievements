import { Admin, Resource } from "react-admin";

import LoginPage from "./pages/LoginPage";
import * as DataProvider from "./providers/DataProvider";
import * as AuthProvider from "./providers/AuthProvider";

import * as Users from "./components/Users";
import * as Achievements from "./components/Achievements";

import { FaUser, FaMedal } from "react-icons/fa";

const App = () => (
  <Admin
    dataProvider={DataProvider}
    authProvider={AuthProvider}
    loginPage={LoginPage}
  >
    <Resource
      name="users"
      icon={FaUser}
      show={Users.UserShow}
      list={Users.UserList}
      create={Users.UserCreate}
      edit={Users.UserEdit}
    />
    <Resource
      name="achievements"
      icon={FaMedal}
      show={Achievements.AchievementShow}
      list={Achievements.AchievementList}
      create={Achievements.AchievementCreate}
    />
  </Admin>
);

export default App;
