import { API_URL } from "./Config";

export class APIError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "APIError";
  }
}

export async function API(method, url, data = undefined) {
  const resp = await fetch(`${API_URL}/${url}`, {
    method,
    credentials: "include",
    headers: Object.assign(
      {},
      data ? { "Content-Type": "application/json" } : null
    ),
    body: data ? JSON.stringify(data) : undefined,
  });
  const body = await resp.json();
  if (!resp.ok) {
    if (body.details) {
      throw new APIError(resp.status, body.details);
    } else {
      throw new APIError(resp.status, resp.statusText);
    }
  }

  return { resp, data: body };
}
