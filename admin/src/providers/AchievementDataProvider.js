import * as Helpers from "./Helpers";

function fixupId(record) {
  return {
    ...record,
    id: `${record.owner_id},${record.id}`,
  };
}
function fixupOne({ data, ...rest }) {
  return {
    data: fixupId(data),
    ...rest,
  };
}
function fixupMany({ data, ...rest }) {
  return {
    data: data.map(fixupId),
    ...rest,
  };
}

export async function getList(resource, { pagination }) {
  const resp = await Helpers.fetchList(
    "achievements/",
    pagination.page,
    pagination.perPage
  );
  return fixupMany(resp);
}

export async function getOne(resource, { id }) {
  const [userId, achievementId] = id.split(",");
  const resp = await Helpers.fetchOne(
    `users/${userId}/achievements/${achievementId}`
  );
  return fixupOne(resp);
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
  const resp = await Helpers.fetchList(`users/${id}/achievements`);
  return fixupMany(resp);
}

export async function createOne(resource, { data }) {
  const { owner_id, ...rest } = data;
  const resp = await Helpers.createOne(`users/${owner_id}/achievements/`, rest);
  return fixupOne(resp);
}

export async function updateOne(resource, { id, data }) {
  const { owner, ...rest } = data;
  let [userId, achievementId] = id.split(",");
  if (userId !== owner) {
    console.warn("cannot change achievement owner after creation");
    return;
  }

  const resp = await Helpers.updateOne(
    `users/${userId}/achievements/${achievementId}`,
    rest
  );
  return fixupOne(resp);
}

export async function deleteOne(resource, { id }) {
  let [userId, achievementId] = id.split(",");
  const resp = await Helpers.deleteOne(
    `users/${userId}/achievements/${achievementId}`
  );
  return fixupOne(resp);
}

export async function deleteMany(resource, { ids }) {
  const resp = await Promise.all(
    ids.map(async (id) => await deleteOne(resource, { id }))
  );
  return { data: resp.map((record) => record.id) };
}
