import type { Request, Response, NextFunction } from 'express';
import { userRegisterService } from '../services/user.register.service.js';
<<<<<<< HEAD
=======
import type { RegisterBody } from '../schemas/user.register.schema.js';
>>>>>>> develop

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
>>>>>>> develop
    });

    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
}
