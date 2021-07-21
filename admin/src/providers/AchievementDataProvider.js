import * as Helpers from "./Helpers";

export async function getList(resource, { pagination }) {
  const { data, ...rest } = await Helpers.fetchList(
    "achievements/",
    pagination.page,
    pagination.perPage
  );
  return {
    data: data.map((record) => ({
      ...record,
      id: `${record.owner_id},${record.id}`,
    })),
    ...rest,
  };
}

export async function getOne(resource, { id }) {
  let [userId, achievementId] = id.split(",");
  let resp = await Helpers.fetchOne(
    `users/${userId}/achievements/${achievementId}`
  );
  resp.data.id = id;
  return resp;
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
  return await Helpers.createOne(`users/${owner_id}/achievements/`, rest);
}

export async function updateOne(resource, { id, data }) {
  const { owner, ...rest } = data;
  let [userId, achievementId] = id.split(",");
  if (userId !== owner) {
    console.warn("cannot change achievement owner after creation");
    return;
  }

  return await Helpers.updateOne(
    `users/${userId}/achievements/${achievementId}`,
    rest
  );
}

export async function deleteOne(resource, { id }) {
  let [userId, achievementId] = id.split(",");
  return await Helpers.deleteOne(
    `/users/${userId}/achievements/${achievementId}`
  );
}
