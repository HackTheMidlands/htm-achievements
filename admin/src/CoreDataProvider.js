import { API } from "./API"

export async function getList(resource, params) {
  let query = new URLSearchParams();
  query.append(
    "offset",
    (params.pagination.page - 1) * params.pagination.perPage
  );
  query.append("limit", params.pagination.perPage);
  const data = await API(`${resource}?${query.toString()}`);
  return {
    data,
    total: data.length, // HACK
  };
}

export async function getOne(resource, params) {
  const data = await API(`${resource}/${params.id}`);
  return { data };
}

export async function getMany(resource, params) {
  return { data: params.ids.map((id) => getOne(resource, { id }).data) };
}
