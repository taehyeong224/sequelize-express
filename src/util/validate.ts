import { ObjectSchema } from "joi";
import { ErrorCode } from "./errorCode";
import { CommonError } from "./errorModel";

export function throwIfInvalid(obj, schema: ObjectSchema) {
  const { error, value } = schema.validate(obj);
  if (error) {
    throw new CommonError(error.message, ErrorCode.INVALID_PARAMS, 400);
  }
  return value;
}
