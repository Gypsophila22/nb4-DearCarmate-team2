import type { NextFunction, Request, Response } from "express";
import z from "zod";
import createError from "http-errors";

const loginSchema = z.object({
  email: z.email({ message: "이메일을 입력해야 합니다." }),
  password: z.string().min(1, { message: "패스워드를 입력해야 합니다." }),
});

export default function authLoginValidate(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const result = loginSchema.safeParse(req.body);

  //문제가 있을 경우 에러 체크
  if (!result.success) {
    console.error(result.error);
    next(createError(400, result.error.message));
  } else {
    next();
  }
}
