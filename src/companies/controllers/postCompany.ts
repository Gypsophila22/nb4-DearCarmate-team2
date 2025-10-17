import type { Request, Response, NextFunction } from "express";
import prisma from "../../config/prisma.js";

// ⚠️ 관리자 권한 확인용 에러 클래스
class UnauthorizedError extends Error {
  statusCode: number;
  constructor(message = "관리자 권한이 필요합니다") {
    super(message);
    this.statusCode = 401;
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

async function createCompany(req: Request, res: Response, next: NextFunction) {
  try {
    // 🔐 관리자 권한 확인 (테스트 중이라 주석 가능)
    // if (!req.user || !req.user.isAdmin) {
    //   throw new UnauthorizedError("관리자 권한이 필요합니다");
    // }

    const rawName = (req.body.companyName ?? req.body.name) as string | undefined;
    const rawCode = (req.body.companyCode ?? req.body.code) as string | undefined;

    const companyName = rawName?.trim();
    const companyCode = rawCode?.trim().toUpperCase();

    if (!companyName || !companyCode) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 중복 코드 확인
    const exists = await prisma.companies.findUnique({
      where: { companyCode },
    });
    if (exists) {
      return res.status(400).json({ message: "이미 존재하는 회사 코드입니다" });
    }

    // 회사 생성
    const company = await prisma.companies.create({
      data: { companyName, companyCode },
    });

    return res.status(201).json({
      id: company.id,
      companyName: company.companyName,
      companyCode: company.companyCode,
      userCount: 0,
    });
  } catch (err: any) {
    if (err instanceof UnauthorizedError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    next(err);
  }
}

export default { createCompany };
