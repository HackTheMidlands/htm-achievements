import { API_URL, ADMIN_URL } from "../Config";
import { API, APIError } from "../API";

export async function login() {
  try {
    await API("GET", "users/@me");
  } catch (err) {
    if (err instanceof APIError && err.status === 401) {
      window.location.assign(`${API_URL}/login/discord?redirect=${ADMIN_URL}`);
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
  await API("GET", "users/@me");
}
export async function logout() {
  if (
    document.cookie.split(";").some((item) => item.trim().startsWith("token="))
  ) {
    window.location.assign(`${API_URL}/logout?redirect=${ADMIN_URL}`);
  }
}
export async function getIdentity() {}
export async function getPermissions() {}
