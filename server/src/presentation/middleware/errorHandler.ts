import { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  InternalServerError,
} from "../../shared/errors";
import logger from "../../shared/utils/logger";
import { HttpStatus } from "../../shared/constants/HttpStatus";
import { StatusMessages } from "../../shared/constants/StatusMessages";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  let message = StatusMessages.INTERNAL_SERVER_ERROR;

  logger.error("Error:", err);

  if (
    err instanceof BadRequestError ||
    err instanceof UnauthorizedError ||
    err instanceof ForbiddenError ||
    err instanceof NotFoundError ||
    err instanceof InternalServerError
  ) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  } else if (typeof err === "string") {
    statusCode = HttpStatus.BAD_REQUEST;
    message = err;
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};
