import joi, { ObjectSchema } from "joi";
joi.object();
export function throwIfInvalid(obj, schema: ObjectSchema) {
  const { error, value } = schema.validate(obj);
  if (error) {
    throw new Error(error.message);
  }
  return value;
}
