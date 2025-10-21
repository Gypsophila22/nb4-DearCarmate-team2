import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { getCompanyService } from "../services/company.get.service.js";

export const getCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ✅ 쿼리 파라미터 파싱
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const searchBy = req.query.searchBy as string | undefined;
    const keyword = req.query.keyword as string | undefined;

    // ⚠️ 유효성 검증
    if (page < 1 || pageSize < 1) {
      throw createHttpError(400, "잘못된 요청입니다");
    }

    // 🔐 관리자 권한 (추후 passport 연결 시 복원)
    if (!req.user?.isAdmin) throw createHttpError(401, "관리자 권한이 필요합니다");

    // 🚀 서비스 호출
    const result = await getCompanyService(page, pageSize, searchBy, keyword);

    // 🎯 응답
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
