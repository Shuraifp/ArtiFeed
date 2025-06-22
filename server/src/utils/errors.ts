import { HttpStatus } from "./HTTPStatusCodes";
import { StatusMessages } from "./HTTPStatusMessages";

export class BadRequestError extends Error {
  statusCode = HttpStatus.BAD_REQUEST;
  constructor(message: string = StatusMessages.BAD_REQUEST) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends Error {
  statusCode = HttpStatus.UNAUTHORIZED;
  constructor(message: string = StatusMessages.UNAUTHORIZED) {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  statusCode = HttpStatus.FORBIDDEN;
  constructor(message: string = StatusMessages.FORBIDDEN) {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends Error {
  statusCode = HttpStatus.NOT_FOUND;
  constructor(message: string = StatusMessages.NOT_FOUND) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class InternalServerError extends Error {
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  constructor(message: string = StatusMessages.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = "InternalServerError";
  }
}