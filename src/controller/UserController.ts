import { User } from "../model/User";

export async function getUsers() {
  return await User.findAll();
}
