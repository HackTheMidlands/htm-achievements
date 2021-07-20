import { API_URL } from "./Config";

export class APIError extends Error {
    constructor(status, message) {
      super(message);
      this.status = status
      this.name = "APIError";
    }
}

export async function API(url) {
  const resp = await fetch(`${API_URL}/${url}`, {
    credentials: "include",
  });
  const body = await resp.json();
  if (!resp.ok) {
    if (body.details) {
      throw new APIError(resp.status, body.details);
    } else {
      throw new APIError(resp.status, resp.statusText);
    }
  }

  return body;
}
