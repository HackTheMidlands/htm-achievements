import { API } from "../API";

export async function fetchOne(endpoint) {
  const data = await API("GET", endpoint);
  return { data };
}

export async function fetchMany(endpoints) {
  const data = await Promise.all(
    endpoints.map(async (endpoint) => (await fetchOne(endpoint)).data)
  );
  return { data, total: data.length };
}

export async function fetchList(
  endpoint,
  page = undefined,
  perPage = undefined
) {
  let query = new URLSearchParams();
  if (page !== undefined && perPage !== undefined) {
    query.append(
      "offset",
      (page - 1) * perPage
    );
    query.append("limit", perPage);
  }

  const url = `${endpoint}?${query.toString()}`;

  const data = await API("GET", url);
  return {
    data,
    total: data.length, // HACK
  };
}

export async function createOne(endpoint, data) {
  const newData = await API("POST", endpoint, data);
  return { data: newData };
}

export async function updateOne(endpoint, data) {
  const newData = await API("PUT", endpoint, data);
  return { data: newData };
}
