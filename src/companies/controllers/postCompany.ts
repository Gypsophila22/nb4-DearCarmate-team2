import type { Request, Response, NextFunction } from "express";
import { PrismaClient } from "../../../generated/prisma/index.js";

const prisma = new PrismaClient();

async function createCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, code } = req.body;

    if (!name || !code) {
      return res.status(400).json({ message: "잘못된 요청입니다" });
    }

    // 중복 코드 확인
    const exists = await prisma.companies.findUnique({
      where: { code },
    });
    if (exists) {
      return res
        .status(400)
        .json({ message: "이미 존재하는 회사 코드입니다" });
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
  } catch (err) {
    next(err);
  }
}

export default { createCompany };
