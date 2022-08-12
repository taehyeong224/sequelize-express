import { Request, Response } from "express";
import dayjs from "dayjs";

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
  res.status(500).json({ msg: "server error" });
}
