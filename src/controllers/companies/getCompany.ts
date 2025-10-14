// 기존 코드: getCompany.ts

import type { Request, Response, NextFunction } from "express";

//Prisma 연결 추가
import { PrismaClient } from "../../../generated/prisma/index.js";
const prisma = new PrismaClient();

// 회사 목록 조회 (GET /admin/companies)
async function getCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", pageSize = "10" } = req.query;

    // 여기에 나중에 prisma.companies.findMany() 로직이 들어갈 예정
    const items = [
      {
        id: 1,
        companyName: "코드카",
        companyCode: "CARMATE123",
        userCount: 5,
        createdAt: new Date().toISOString(),
      },
    ];

    const pageInfo = {
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: 1,
      totalItems: items.length,
    };

    return res.json({ success: true, data: { items, pageInfo } });
  } catch (err) {
    next(err);
  }
}

export default { getCompany };
