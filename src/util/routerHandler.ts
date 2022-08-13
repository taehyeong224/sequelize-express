import { Request, Response } from "express";
import dayjs from "dayjs";
import { CommonError } from "./errorModel";

export function commonRequestHandler(
  req: Request,
  res: Response,
  error: Error
) {
  console.error(
    `[${dayjs().format("YYYY-MM-DD[T]HH:mm:ss+09:00")}] ${req.method} ${
      req.originalUrl
    } ${error.message}`
  );

  if (error instanceof CommonError) {
    return res.status(error.statusCode).json({
      code: error.errorCode,
      statusCode: error.statusCode,
      message: error.getErrorMessage(),
    });
  }
  res.status(500).json({ msg: "server error" });
}
