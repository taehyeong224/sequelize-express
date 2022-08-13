import { User } from "../model/User";
import { pickBy, identity, isEmpty } from "lodash";
import crypto from "crypto";
import { CommonError } from "../util/errorModel";
import { ErrorCode } from "../util/errorCode";

export async function getUsers() {
  console.log("getUsers");
  return await User.findAll();
}

export async function createUser(params: {
  userName: string;
  password: string;
}) {
  console.log("createUser params : ", params);
  const { userName, password } = params;
  const { password: encryptPassword, salt } = await createPassword(password);
  await User.create({ userName, password: encryptPassword, salt });
}

function createSalt(): string {
  try {
    const buf = crypto.randomBytes(64);
    return buf.toString("base64");
  } catch (e) {
    console.error("createSalt error : ", e.message);
    throw new CommonError(
      "fail create password",
      ErrorCode.FAIL_CREATE_PASSWORD,
      500
    );
  }
}

function createPassword(
  plainPassword: string
): Promise<{ password: string; salt: string }> {
  return new Promise((resolve, reject) => {
    const salt = createSalt();
    crypto.pbkdf2(plainPassword, salt, 9999, 64, "sha512", (err, key) => {
      if (err) reject(err);
      resolve({ password: key.toString("base64"), salt });
    });
  });
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
  let changedPassword;
  removeFalse.password &&
    (changedPassword = await createPassword(removeFalse.password)) &&
    (await User.update(
      {
        ...removeFalse,
        password: changedPassword.password,
        salt: changedPassword.salt,
      },
      { where: { id } }
    ));
  isEmpty(removeFalse.password) &&
    (await User.update(removeFalse, { where: { id } }));
}

export async function removeUser(id: number) {
  console.log("removeUser id : ", id);
  await User.update({ isDelete: true }, { where: { id } });
}
