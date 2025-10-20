import { Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../lib/prisma.js";
export const getCustomers = async (req: Request, res: Response) => {
  try {
    // 로그인한 유저의 회사 ID를 가져옵니다
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res
        .status(401)
        .json({ message: "인증된 사용자 정보가 없습니다." });
    }

    // 페이지네이션 추가
    const page = parseInt(String(req.query.page) || "1");
    const pageSize = parseInt(String(req.query.pageSize) || "10", 10);
    const skip = (page - 1) * pageSize;
    const { searchBy, keyword } = req.query;

    const where: Prisma.CustomersWhereInput = {
      companyId: companyId,
    };

    if (searchBy && keyword) {
      const searchByString = String(searchBy);
      const keywordString = String(keyword);
      if (searchByString === "name") {
        where.name = {
          contains: keywordString,
        };
      } else if (searchByString === "email") {
        where.email = {
          contains: keywordString,
        };
      }
    }

    const customers = await prisma.customers.findMany({
      where,
      take: pageSize,
      skip: skip,
    });

    const totalCustomers = await prisma.customers.count({
      where,
    });

    const totalPages = Math.ceil(totalCustomers / pageSize);

    res.status(200).json({
      data: customers,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 내부 오류가 발생하였습니다." });
  }
};
