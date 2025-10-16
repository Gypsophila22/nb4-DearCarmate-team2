import type { Request, Response, NextFunction } from 'express';
import { userRegisterService } from '../services/user.register.service.js';
<<<<<<< HEAD
=======
import type { RegisterBody } from '../schemas/user.register.schema.js';
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

export async function postRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
<<<<<<< HEAD
    const user = await userRegisterService.register({
      name: req.body.name,
      email: req.body.email,
      employeeNumber: req.body.employeeNumber,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      companyName: req.body.companyName,
      companyCode: req.body.companyCode,
=======
    const { body } = (req as any).validated as { body: RegisterBody };

    const user = await userRegisterService.register({
      name: body.name,
      email: body.email,
      employeeNumber: body.employeeNumber,
      phoneNumber: body.phoneNumber,
      password: body.password,
      company: body.company,
      companyCode: body.companyCode,
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
    });

    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
}
