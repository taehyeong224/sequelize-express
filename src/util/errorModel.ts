import { ErrorCode } from "./errorCode";

export class CommonError extends Error {
  errorCode: ErrorCode;
  statusCode: number;

  constructor(message: string, code: ErrorCode, status: number) {
    super(message);
    this.errorCode = code;
    this.statusCode = status;
  }

  getErrorMessage() {
    return this.message;
  }
}
