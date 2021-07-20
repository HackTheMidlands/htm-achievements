import * as Achievements from "./AchievementDataProvider.js"
import * as Users from "./UserDataProvider.js"

const lookupTable = {
    users: Users,
    achievements: Achievements,
}
function lookup(method) {
    return function (resource, params) {
        return lookupTable[resource][method](resource, params)
    }
}

export const getList = lookup("getList")
export const getOne = lookup("getOne")
export const getMany = lookup("getMany")
export const getManyReference = lookup("getManyReference")

export const create = lookup("create")
export const update = lookup("update")
