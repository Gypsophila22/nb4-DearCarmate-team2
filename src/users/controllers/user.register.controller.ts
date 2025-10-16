import type { Request, Response, NextFunction } from 'express';
import { userRegisterService } from '../services/user.register.service.js';

export async function postRegister(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userRegisterService.register({
      name: req.body.name,
      email: req.body.email,
      employeeNumber: req.body.employeeNumber,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      company: req.body.company,
      companyCode: req.body.companyCode,
    });

    return res.status(201).json(user);
  } catch (err) {
    return next(err);
  }
}
