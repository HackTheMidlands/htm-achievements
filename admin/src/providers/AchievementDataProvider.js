import * as Helpers from "./Helpers";

export async function getList(resource, { pagination }) {
  return await Helpers.fetchList(
    "achievements/",
    pagination.page,
    pagination.perPage
  );
}

export async function getOne(resource, { id }) {
  let [userId, achievementId] = id.split(",");
  if (achievementId === undefined) {
    return await Helpers.fetchOne(`achievements/${id}`);
  } else {
    let resp = await Helpers.fetchOne(
      `users/${userId}/achievements/${achievementId}`
    );
    resp.data.id = id;
    return resp;
  }
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

export async function create(resource, { data }) {
  const { owner, ...rest } = data;
  return await Helpers.createOne(`users/${owner}/achievements/`, rest);
}

export async function update(resource, { id, data }) {
  const { owner, ...rest } = data;
  let [userId, achievementId] = id.split(",");
  if (achievementId === undefined) {
    return await Helpers.updateOne(`users/${owner}/achievements/${id}`, rest);
  } else {
    if (userId !== owner) {
      console.warn("cannot change achievement owner after creation");
      return;
    }
    return await Helpers.updateOne(
      `users/${owner}/achievements/${achievementId}`,
      rest
    );
  }
}
