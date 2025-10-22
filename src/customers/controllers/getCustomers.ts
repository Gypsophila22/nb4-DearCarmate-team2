import { AgeGroup, Prisma } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../lib/prisma.js";

const ageGroupDisplayMap: { [key in AgeGroup]: string } = {
  [AgeGroup.GENERATION_10]: '10대',
  [AgeGroup.GENERATION_20]: '20대',
  [AgeGroup.GENERATION_30]: '30대',
  [AgeGroup.GENERATION_40]: '40대',
  [AgeGroup.GENERATION_50]: '50대',
  [AgeGroup.GENERATION_60]: '60대',
  [AgeGroup.GENERATION_70]: '70대',
  [AgeGroup.GENERATION_80]: '80대',
};

export const getCustomers = async (req: Request, res: Response) => {
  try {
    // 로그인한 유저의 회사 ID를 가져옵니다
    const companyId = req.user?.companyId;
    if (!companyId) {
      return res
        .status(401)
        .json({ message: '인증된 사용자 정보가 없습니다.' });
    }

    // 페이지네이션 추가
    const page = parseInt(String(req.query.page) || '1');
    const pageSize = parseInt(String(req.query.pageSize) || '10', 10);
    const skip = (page - 1) * pageSize;
    const { searchBy, keyword } = req.query;

    const where: Prisma.CustomersWhereInput = {
      companyId: companyId,
    };

    if (searchBy && keyword) {
      const searchByString = String(searchBy);
      const keywordString = String(keyword);
      if (searchByString === 'name') {
        where.name = {
          contains: keywordString,
        };
      } else if (searchByString === 'email') {
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

    const transformedCustomers = customers.map((customer) => ({
      ...customer,
      ageGroup: customer.ageGroup
        ? ageGroupDisplayMap[customer.ageGroup as AgeGroup]
        : null,
    }));

    res.status(200).json({
      data: transformedCustomers,
      currentPage: page,
      totalPages,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 내부 오류가 발생하였습니다.' });
  }
};
