import * as Helpers from "./Helpers";

export async function getList(resource, { pagination }) {
  return await Helpers.fetchList(
    "achievements/",
    pagination.page,
    pagination.perPage
  );
}

export async function getOne(resource, { id }) {
  return await Helpers.fetchOne(`achievements/${id}`);
}

export async function getMany(resource, { ids }) {
  return {
    data: await Promise.all(
      ids.map(async (id) => (await getOne(resource, { id })).data)
    ),
  };
}

export async function getManyReference(resource, { target, id }) {
  if (target !== "owner_id") {
    console.warn(`cannot get referenced field ${target}`);
    return;
  }
  return await Helpers.fetchList(`users/${id}/achievements`);
}

export async function createOne(resource, { data }) {
  const { owner_id, ...rest } = data;
  return await Helpers.createOne(`achievements/`, {
    owner_ref: owner_id,
    ...rest,
  });
}

export async function updateOne(resource, { id, data }) {
  return await Helpers.updateOne(`achievements/${id}`, data);
}

export async function deleteOne(resource, { id }) {
  return await Helpers.deleteOne(`achievements/${id}`);
}

export async function deleteMany(resource, { ids }) {
  return await Promise.all(
    ids.map(async (id) => (await deleteOne(resource, { id })).id)
  );
}
