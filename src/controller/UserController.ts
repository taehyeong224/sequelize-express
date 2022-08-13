import { User } from "../model/User";
import { pickBy, identity } from "lodash";

export async function getUsers() {
  console.log("getUsers");
  return await User.findAll();
}

export async function createUser(params: {
  userName: string;
  password: string;
}) {
  console.log("createUser params : ", params);
  await User.create(params);
}

export async function changeUser(
  id: number,
  params: {
    userName: string;
    password: string;
  }
) {
  console.log("changeUser id, params: ", id, params);
  const removeFalse = pickBy(params, identity);
  await User.update(removeFalse, { where: { id } });
}

export async function removeUser(id: number) {
  console.log("removeUser id : ", id);
  await User.update({ isDelete: true }, { where: { id } });
}
