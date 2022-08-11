import { User } from "src/model/user";

export async function getUsers () {
  return User.findAll()
}
