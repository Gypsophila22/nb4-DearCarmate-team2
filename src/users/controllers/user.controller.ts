import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { userDeleteService } from '../services/user.delete.service.js';
import { userGetService } from '../services/user.get.service.js';
import { userPatchService } from '../services/user.patch.service.js';
import { userRegisterService } from '../services/user.register.service.js';
import { userRepository } from '../repositories/user.repository.js';

// 인덱스 거치지 않음

class UserController {
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user!.isAdmin)
        throw createError(403, '관리자 권한이 필요합니다.');
      const id = Number(req.params.id);
      const result = await userDeleteService.deleteByAdmin(id);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = req.user;
      if (!auth) throw createError(401, '로그인이 필요합니다.');
      const { password } = req.body;
      if (!password) throw createError(400, '비밀번호가 필요합니다.');
      const dbUser = await userRepository.findById(auth.id);
      if (!dbUser) throw createError(404, '존재하지 않는 유저입니다.');
      const match = await bcrypt.compare(password, dbUser.password);
      if (!match) throw createError(401, '비밀번호가 올바르지 않습니다.');
      const result = await userDeleteService.deleteMe(dbUser.id);
      return res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw createError(401, '로그인이 필요합니다.');
      const user = await userGetService.getMe(req.user.id);
      return res.json(user);
    } catch (e) {
      return next(e);
    }
  }
  async patchUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) throw createError(401, '로그인이 필요합니다.');

      const safeUser = await userPatchService.patchMe(req.user.id, req.body);
      return res.json(safeUser);
    } catch (err) {
      next(err);
    }
  }

  async postRegister(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userRegisterService.register({
        name: req.body.name,
        email: req.body.email,
        employeeNumber: req.body.employeeNumber,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        companyName: req.body.companyName,
        companyCode: req.body.companyCode,
      });

      return res.status(201).json(user);
    } catch (err) {
      return next(err);
    }
  }
}

export const userController = new UserController();
