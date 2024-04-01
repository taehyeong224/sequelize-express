import { Request, Response } from "express";
import dayjs from "dayjs";
import { CommonError } from "../util/errorModel";

export function errorHandler(error: Error, req: Request, res: Response) {
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

export const asyncMiddleware = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const syncMiddleware = (fn) => (req, res, next) => {
  try {
    fn(req, res, next);
  } catch (error) {
    next(error);
  }
};
