import { API } from "./API";

export async function getList(resource, params) {
  let query = new URLSearchParams();
  query.append(
    "offset",
    (params.pagination.page - 1) * params.pagination.perPage
  );
  query.append("limit", params.pagination.perPage);
  const data = await API("GET", `${resource}?${query.toString()}`);
  return {
    data,
    total: data.length, // HACK
  };
}

export async function getOne(resource, { id }) {
  const data = await API("GET", `${resource}/${id}`);
  return { data };
}

export async function getMany(resource, { ids }) {
  const data = await Promise.all(
    ids.map(async (id) => (await getOne(resource, { id })).data)
  );
  return { data, total: data.length };
}

export async function getManyReference(resource, { target, id }) {
  console.log(resource, target, id);
  const data = await API("GET", `${target}/${id}/${resource}`);
  return { data, total: data.length };
}

export async function create(resource, { data }) {
  const newData = await API("POST", `${resource}`, data);
  return { data: newData };
}

export async function update(resource, { id, data }) {
  const newData = await API("PUT", `${resource}/id`, data);
  return { data: newData };
}
