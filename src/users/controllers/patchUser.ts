import { PrismaClient } from "../../../generated/prisma/index.js";
import type { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import type { UpdateUserDTO } from "../../auth/dtos/userDto.js";
import createError from "http-errors";

const prisma = new PrismaClient();

class PatchUser {
  async patchMe(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(createError(401, "로그인이 필요합니다."));
      }

      const {
        employeeNumber,
        phoneNumber,
        currentPassword,
        password,
        passwordConfirmation,
        imageUrl,
      }: UpdateUserDTO = req.body;

      // 유저 확인
      const user = await prisma.users.findUnique({
        where: { id: req.user.id },
      });
      if (!user) {
        return next(createError(404, "존재하지 않는 유저입니다."));
      }

      // currentPassword 검증
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) {
        return next(createError(400, "현재 비밀번호가 맞지 않습니다."));
      }

      // 수정 데이터 준비
      const dataToUpdate: Partial<UpdateUserDTO> = {};
      if (employeeNumber) dataToUpdate.employeeNumber = employeeNumber;
      if (phoneNumber) dataToUpdate.phoneNumber = phoneNumber;
      if (imageUrl) dataToUpdate.imageUrl = imageUrl;

      // 새 비밀번호 있는 경우만 업데이트
      if (password) {
        if (password !== passwordConfirmation) {
          return next(
            createError(400, "비밀번호와 비밀번호 확인이 일치하지 않습니다.")
          );
        }
        dataToUpdate.password = await bcrypt.hash(password, 10);
      }

      // 업데이트
      const updated = await prisma.users.update({
        where: { id: user.id },
        data: dataToUpdate,
      });

      const { password: _, ...safeUser } = updated;
      return res.json(safeUser);
    } catch (e) {
      console.error(e);
      return next(createError(500, "서버 에러."));
    }
  }
}

export default new PatchUser();
