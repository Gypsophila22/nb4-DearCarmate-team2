import createError from 'http-errors';

import contractService from '../services/index.js';

import type { NextFunction, Request, Response } from 'express';

// 계약 등록 컨트롤러
export const createContractsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) throw createError(401, '로그인이 필요합니다.');

    // 계약 생성 서비스 호출
    const result = await contractService.create({
      carId: req.body.carId, // 차량
      customerId: req.body.customerId, // 고객
      meetings: req.body.meetings, // 일정
      userId: req.user.id, // 로그인 유저 ID (계약 담당자)
    });

    return res.status(201).json({
      contract: result,
    });
  } catch (err) {
    next(err);
  }
};
