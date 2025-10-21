import type { Request, Response, NextFunction } from "express";
import prisma from '../../lib/prisma.js';
import { companyRepository } from '../repositories/company.repository.js';
import createHttpError from 'http-errors';

export const patchCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { companyId } = req.params;
    const { companyName, companyCode } = req.body;

    // 🔐 관리자 권한 확인
    if (!req.user || !req.user.isAdmin) {
      next(createHttpError(401, '관리자 권한이 필요합니다.'));
    }

    // 1️⃣ 요청 검증
    if (!companyId || !companyName?.trim() || !companyCode?.trim()) {
      next(createHttpError(400, '잘못된 요청입니다.'));
    }

    const id = Number(companyId);

    // 2️⃣ 존재 확인
    const exist = await prisma.companies.findUnique({
      where: { id },
    });

    if (!exist) next(createHttpError(404, '존재하지 않는 회사입니다.'));

    // 3️⃣ 수정 실행 (Repository 호출)
    const company = await companyRepository.updateCompanyById(id, {
      companyName,
      companyCode,
    });

    // 4️⃣ 응답 매핑 (명세서 형식)
    return res.status(200).json({
      id: company.id,
      companyName: company.companyName,
      companyCode: company.companyCode,
      userCount: company.userCount,
    });
  } catch (err) {
    // 5️⃣ 에러 처리
    if (createHttpError.isHttpError(err)) {
      return res.status(err.status).json({ message: err.message });
    }
    next(err); // 기타 예외는 전역 에러핸들러로
  }
};
