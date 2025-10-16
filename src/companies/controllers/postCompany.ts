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
    // // 🔐 관리자 권한 확인
    // if (!req.user || !req.user.isAdmin) {
    //   throw new UnauthorizedError("관리자 권한이 필요합니다");
    // }

    // const { name, code } = req.body;
    // 디버깅용 테스트 -
    const rawName = (req.body.name ?? req.body.companyName) as
      | string
      | undefined;
    const rawCode = (req.body.code ?? req.body.companyCode) as
      | string
      | undefined;

    const name = rawName?.trim();
    const code = rawCode?.trim().toUpperCase();

    if (!name || !code) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 중복 코드 확인
    const exists = await prisma.companies.findUnique({
      where: { code },
    });
    if (exists) {
      return res.status(400).json({ message: "이미 존재하는 회사 코드입니다" });
    }

    const company = await prisma.companies.create({
      data: { name, code },
    });

    return res.status(201).json({
      id: company.id,
      companyName: company.name,
      companyCode: company.code,
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
