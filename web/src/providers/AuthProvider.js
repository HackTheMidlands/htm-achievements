import { API_URL, SITE_URL } from "../Config";
import { API, APIError } from "../API";



export async function login() {
  try {
    await API("GET", "users/@me");
  } catch (err) {
    if (err instanceof APIError && err.status === 401) {
      window.location.assign(`${API_URL}/login/discord?redirect=${SITE_URL}`);
    }
    throw err;
  }

}

export async function checkError(error) {
  if (error.status === 401) {
    throw error;
  }
}
export async function checkAuth() {
  try {
    await API("GET", "users/@me")//.then(value => { console.log(value) });
    console.log("logged in")
    return true
  }catch (err) {
    if (err instanceof APIError && err.status === 401) {
      console.log("logged out")
      // AuthHandler.logged_in = false;
      return false
      // window.location.assign(`${API_URL}/login/discord?redirect=${SITE_URL}`);
    }
    // throw err;
  }
}

export async function getAchievements() {
  try {
    return await API("GET", "users/@me/achievements")//.then(value => { console.log(value) });
  }catch (err) {
    if (err instanceof APIError && err.status === 401) {
      // console.log("logged out")
      
    }
    throw err
    // throw err;
  }
}

export async function logout() {
  if (
    document.cookie.split(";").some((item) => item.trim().startsWith("token="))
  ) {
    window.location.assign(`${API_URL}/logout?redirect=${SITE_URL}`);
  }
}
export async function getIdentity() {}
export async function getPermissions() {}

