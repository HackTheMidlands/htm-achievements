import { Admin, Resource } from "react-admin";
import Layout from "./Layout.js";

import LoginPage from "./pages/LoginPage";
import DataProvider from "./providers/DataProvider";
import * as AuthProvider from "./providers/AuthProvider";

import * as Users from "./components/Users";
import * as Achievements from "./components/Achievements";

import useTheme from "./hooks/useTheme";
import { FaUser, FaMedal } from "react-icons/fa";

const App = () => {
  const theme = useTheme();

  return (
    <Admin
      layout={Layout}
      theme={theme}
      dataProvider={DataProvider}
      authProvider={AuthProvider}
      loginPage={LoginPage}
    >
      <Resource
        name="users"
        icon={FaUser}
        show={Users.UserShow}
        list={Users.UserList}
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
};

export default App;
