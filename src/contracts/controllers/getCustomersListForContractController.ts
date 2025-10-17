import prisma from '../../lib/prisma.js';

import type { Request, Response, NextFunction } from 'express';

// 계약용 고객 목록 조회 컨트롤러
export const getCustomersListForContractController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 고객 전체 조회 (필요시 회사별로 필터 가능)
    const customers = await prisma.customers.findMany({
      orderBy: { id: 'asc' },
    });

    // '이름(이메일)' 형태로 변환
    const result = customers.map((c) => ({
      id: c.id,
      data: `${c.name}(${c.email ?? ''})`,
    }));

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
