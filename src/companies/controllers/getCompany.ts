// // 기존 코드: getCompany.ts

// import type { Request, Response, NextFunction } from "express";

// //Prisma 연결 추가
// import { PrismaClient } from "../../../generated/prisma/index.js";
// const prisma = new PrismaClient();

// // 회사 목록 조회 (GET /admin/companies)
// async function getCompany(req: Request, res: Response, next: NextFunction) {
//   try {
//     const { page = "1", pageSize = "10" } = req.query;

//     // 여기에 나중에 prisma.companies.findMany() 로직이 들어갈 예정
//     const items = [
//       {
//         id: 1,
//         companyName: "코드카",
//         companyCode: "CARMATE123",
//         userCount: 5,
//         createdAt: new Date().toISOString(),
//       },
//     ];

//     const pageInfo = {
//       page: Number(page),
//       pageSize: Number(pageSize),
//       totalPages: 1,
//       totalItems: items.length,
//     };

//     return res.json({ success: true, data: { items, pageInfo } });
//   } catch (err) {
//     next(err);
//   }
// }

import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';

async function getCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt((req.query.page as string) ?? '1', 10) || 1;
    const pageSize = parseInt((req.query.pageSize as string) ?? '10', 10) || 10;
    const skip = (page - 1) * pageSize;

    const totalItems = await prisma.companies.count();

    const companies = await prisma.companies.findMany({
      skip,
      take: pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { user: true } },
      },
    });

    const items = companies.map((c) => ({
      id: c.id,
      companyName: c.companyName,
      companyCode: c.companyCode,
      userCount: c._count.user,
      // createdAt: c.createdAt,
    }));

    const pageInfo = {
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
      totalItems,
    };

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





