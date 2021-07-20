import { API_URL, ADMIN_URL } from "./Config";
import { API, APIError } from "./API";

export async function login() {
  try {
    await API("GET", "users/@me");
  } catch (err) {
    if (err instanceof APIError && err.status === 401) {
      window.location.assign(`${API_URL}/login?redirect=${ADMIN_URL}`);
    }
    throw err;
  }
}

export async function checkError(error) {
  if (error.status === 401 || error.status === 403) {
    throw error;
  }
}
export async function checkAuth() {
  await API("GET", "users/@me");
}
export async function logout() {
  // clear cookie
  document.cookie = `token=; domain=achieve.localhost; Max-Age=0`;
}
export async function getIdentity() {}
export async function getPermissions() {}
