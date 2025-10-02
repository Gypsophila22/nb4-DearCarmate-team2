import type { Request, Response, NextFunction } from "express";
import httpError from "http-errors";

export default function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (httpError(err)) {
    const errMsg = `서버 에러, 코드 : ${err.status}, 에러명 : ${err.message}`;

    console.error(errMsg);
    return res.status(err.status).send(errMsg);
  }
}
