import type { Request, Response, NextFunction } from 'express';
import { userRegisterService } from '../services/user.register.service.js';
import type { RegisterBody } from '../schemas/user.register.schema.js';

export async function postRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { body } = (req as any).validated as { body: RegisterBody };

    const user = await userRegisterService.register({
      name: body.name,
      email: body.email,
      employeeNumber: body.employeeNumber,
      phoneNumber: body.phoneNumber,
      password: body.password,
      companyName: body.companyName,
      companyCode: body.companyCode,
    });

    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
}
