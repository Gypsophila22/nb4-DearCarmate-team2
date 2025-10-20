import type { Request, Response, NextFunction } from "express";
import prisma from '../../lib/prisma.js';
import { companyRepository } from '../repositories/companyRepository.js';
import createHttpError from 'http-errors';
import type { responseEncoding } from "axios";

// ----- 컨트롤러 -----
const deleteCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.params;

    // 🔐 관리자 권한 확인
    if (!req.user || !req.user.isAdmin) {
      next(createHttpError(401, '관리자 권한이 필요합니다.'));
    }

    // 1️⃣ 요청값 검증
    if (!companyId) {
      next(createHttpError(400, '잘못된 요청입니다.'));
    }

    const id = Number(companyId);

    // 2️⃣ 존재 확인
    const exist = await prisma.companies.findUnique({ where: { id } });
    if (!exist) next(createHttpError(404, '존재하지 않는 회사입니다.'));

    // 3️⃣ 삭제 실행
    const result = await companyRepository.deleteCompanyById(id);

    // 4️⃣ 응답
    return res.status(200).json(result);
  } catch (err) {
    if (createHttpError.isHttpError(err)) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err);
  }
};

export default deleteCompany;
