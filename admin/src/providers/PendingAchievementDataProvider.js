import * as Helpers from "./Helpers";

export async function getList(resource, { pagination }) {
  return await Helpers.fetchList(
    "pending_achievements/",
    pagination.page,
    pagination.perPage
  );
}

export async function getOne(resource, { id }) {
  return await Helpers.fetchOne(`pending_achievements/${id}`);
}

export async function getMany(resource, { ids }) {
  return {
    data: await Promise.all(
      ids.map(async (id) => (await getOne(resource, { id })).data)
    ),
  };
}
