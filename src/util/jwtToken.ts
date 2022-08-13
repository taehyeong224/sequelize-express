import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { CommonError } from "../util/errorModel";
import { ErrorCode } from "./errorCode";

dotenv.config();

const { JWT_KEY } = process.env;
const issuer = "kth";

export function createToken(userId: number, expiresIn) {
  return jwt.sign({ userId }, JWT_KEY, {
    algorithm: "HS256",
    expiresIn,
    issuer,
  });
}

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_KEY, { issuer });
    console.log("decoded = ", decoded);
    if (typeof decoded === "string")
      throw new CommonError("invalid token", ErrorCode.INVALID_TOKEN, 401);
    return {
      userId: decoded.userId,
    };
  } catch (err) {
    console.error("verifyToken err : ", err.message);
    throw new CommonError("invalid token", ErrorCode.INVALID_TOKEN, 401);
  }
}
