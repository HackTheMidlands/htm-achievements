import * as Helpers from "./Helpers";

export async function getList(resource, { pagination }) {
  return await Helpers.fetchList("users/", pagination.page, pagination.perPage);
}

export async function getOne(resource, { id }) {
  return await Helpers.fetchOne(`users/${id}`);
}

export async function getMany(resource, { ids }) {
  return {
    data: await Promise.all(
      ids.map(async (id) => (await getOne(resource, { id })).data)
    ),
  };
}

export async function createOne(resource, { data }) {
  return await Helpers.createOne("users/", data);
}

export async function updateOne(resource, { id, data }) {
  return await Helpers.updateOne(`users/${id}`, data);
}

export async function deleteOne(resource, { id }) {
  return await Helpers.deleteOne(`users/${id}`);
}

export async function deleteMany(resource, { ids }) {
  await Promise.all(ids.map(async (id) => await deleteOne(resource, { id })));
  return { data: ids };
}
