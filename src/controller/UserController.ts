import { User } from "../model/User";
import { pickBy, identity, isEmpty } from "lodash";
import crypto from "crypto";
import { CommonError } from "../util/errorModel";
import { ErrorCode } from "../util/errorCode";
import { createToken } from "../util/jwtToken";

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
  const user = await User.findOne({ where: { userName } });
  if (user) throw new CommonError("already use", ErrorCode.DUPLICATED, 400);
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
  plainPassword: string,
  salt?: string
): Promise<{ password: string; salt: string }> {
  return new Promise((resolve, reject) => {
    const newSalt = salt || createSalt();
    crypto.pbkdf2(plainPassword, newSalt, 9999, 64, "sha512", (err, key) => {
      if (err) reject(err);
      resolve({ password: key.toString("base64"), salt: newSalt });
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

export async function loginUser(userName: string, password: string) {
  const user: any = await User.findOne({ where: { userName }, raw: true });
  if (!user) throw new CommonError("login fail", ErrorCode.LOGIN_FAIL, 401);

  const encryptPassword = await createPassword(password, user.salt);
  if (encryptPassword.password !== user.password) {
    console.log("password not match");
    throw new CommonError("login fail", ErrorCode.LOGIN_FAIL, 401);
  }

  const { JWT_EXPIRE, JWT_REFRESH_EXPIRE } = process.env;
  const accessToken = createToken(user.id, JWT_EXPIRE);
  const refreshToken = createToken(user.id, JWT_REFRESH_EXPIRE);

  return {
    accessToken,
    refreshToken,
  };
}
