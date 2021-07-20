import { API } from "../API";

export async function fetchOne(endpoint) {
  const { data } = await API("GET", endpoint);
  return { data };
}

export async function fetchList(
  endpoint,
  page = undefined,
  perPage = undefined
) {
  let query = new URLSearchParams();
  if (page !== undefined && perPage !== undefined) {
    query.append("offset", (page - 1) * perPage);
    query.append("limit", perPage);
  }

  const url = `${endpoint}?${query.toString()}`;

  const { data, resp } = await API("GET", url);
  return {
    data,
    total: parseInt(resp.headers.get("X-Total-Count")) || data.length,
  };
}

export async function createOne(endpoint, data) {
  const { data: ndata } = await API("POST", endpoint, data);
  return { ndata };
}

export async function updateOne(endpoint, data) {
  const { data: ndata } = await API("PUT", endpoint, data);
  return { ndata };
}
