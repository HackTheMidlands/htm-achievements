import * as Achievements from "./AchievementDataProvider.js";
import * as Users from "./UserDataProvider.js";

const lookupTable = {
  users: Users,
  achievements: Achievements,
};
function lookup(method) {
  return function (resource, params) {
    return lookupTable[resource][method](resource, params);
  };
}

const DataProvider = {
  getList: lookup("getList"),
  getOne: lookup("getOne"),
  getMany: lookup("getMany"),
  getManyReference: lookup("getManyReference"),

  create: lookup("createOne"),
  update: lookup("updateOne"),
  delete: lookup("deleteOne"),
  deleteMany: lookup("deleteMany"),
};
export default DataProvider;
