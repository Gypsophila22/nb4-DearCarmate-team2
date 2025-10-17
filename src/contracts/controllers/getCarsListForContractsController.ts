import prisma from '../../lib/prisma.js';

import type { Request, Response, NextFunction } from 'express';

// 보유중 차량 목록 조회 컨트롤러
export const getCarsListForContractController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 상태가 'possession'인 차량 조회
    // 보유중 차량 + 모델 정보 조회
    const cars = await prisma.cars.findMany({
      where: { status: 'possession' },
      include: {
        carModel: true, // carModel 조인
      },
      orderBy: { id: 'asc' },
    });

    // '차종(차량번호)' 형태로 매핑
    const result = cars.map((car) => ({
      id: car.id,
      data: `${car.carModel.model}(${car.carNumber})`,
    }));

    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
