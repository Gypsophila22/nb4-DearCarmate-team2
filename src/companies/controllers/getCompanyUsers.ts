import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { getCompanyUsersService } from "../services/company.getUsers.service.js";

export const getCompanyUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    const searchBy = req.query.searchBy as string | undefined;
    const keyword = req.query.keyword as string | undefined;

    if (page < 1 || pageSize < 1) {
      throw createHttpError(400, "잘못된 요청입니다");
    }

    // 🔐 관리자 권한 확인 (추후 활성화)
    if (!req.user?.isAdmin) throw createHttpError(401, "관리자 권한이 필요합니다.");

    const result = await getCompanyUsersService(page, pageSize, searchBy, keyword);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
