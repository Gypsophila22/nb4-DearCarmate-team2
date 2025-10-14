import { createContractsService } from '../services/createContractsService.js';

import type { NextFunction, Request, Response } from 'express';

// 계약 등록 컨트롤러
export const createContractsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }

    const { carId, customerId, meetings } = req.body;

    // 요청 검증 (TODO: 나중에 다른파일로 빼면서 데이터 검증추가하기)
    if (!carId || !customerId || !Array.isArray(meetings)) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 로그인된 사용자 ID 추출
    const userId = (req.user as { id: number }).id;

    // 계약 생성 서비스 호출
    const result = await createContractsService({
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
