import contractService from '../services/index.js';

import type { Meetings } from '@prisma/client';

import type { NextFunction, Request, Response } from 'express';

// 계약 등록 컨트롤러
export const createContractsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { carId, customerId, meetings } = req.schema as {
      carId: number;
      customerId: number;
      meetings: { date: string; alarms: string[] }[];
    };

    // 로그인된 사용자 ID 추출
    const userId = (req.user as { id: number }).id;

    // 계약 생성 서비스 호출
    const result = await contractService.create({
      carId, // 차량
      customerId, // 고객
      meetings, // 일정
      userId, // 로그인 유저 ID (계약 담당자)
    });

    // 응답
    return res.status(201).json({
      contract: result,
    });
  } catch (err) {
    next(err);
  }
};
