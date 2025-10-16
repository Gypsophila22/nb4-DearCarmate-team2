import prisma from '../../lib/prisma.js';

import type { Request, Response, NextFunction } from 'express';

// 계약용 유저 목록 조회 컨트롤러
export const getUsersListForContractController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 유저 전체 조회 (필요시 회사별로 필터 가능)
    const users = await prisma.users.findMany({
      orderBy: { id: 'asc' },
    });

    // '이름(이메일)' 형태로 변환
    const result = users.map((c) => ({
      id: c.id,
      data: `${c.name}(${c.email ?? ''})`,
    }));

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
