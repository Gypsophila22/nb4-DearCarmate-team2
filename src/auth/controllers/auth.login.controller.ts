import type { Request, Response, NextFunction } from 'express';
import { authLoginService } from '../services/auth.login.service.js';

async function authLoginController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const result = await authLoginService.login(email, password);
    return res.status(200).json(result);
  } catch (err) {
    return next(err);
  }
}

export default authLoginController;
