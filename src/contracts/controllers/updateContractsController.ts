import contractsService from '../services/index.js';

import type { Request, Response, NextFunction } from 'express';
import type { ContractsStatus } from '@prisma/client';

/**
 * 계약 업데이트
 */
export const updateContractsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { contractId } = req.paramsDto as {
      contractId: number;
    };

    const {
      status, // 계약 상태
      resolutionDate, // 계약 종료일
      contractPrice, // 계약 가격
      meetings, // 일정 (date, alarms)
      contractDocuments, // 계약서 (id, fileName)
      userId, // 담당자
      customerId, // 고객
      carId, // 차량 번호
    } = req.bodyDto as {
      status: ContractsStatus;
      resolutionDate: string;
      contractPrice: number;
      meetings: { date: string; alarms: string[] }[];
      contractDocuments: { id: number; fileName: string }[];
      userId: number;
      customerId: number;
      carId: number;
    }; // 요청 데이터 추출

    // 계약 업데이트 서비스 호출
    const result = await contractsService.update({
      contractId,
      status,
      resolutionDate,
      contractPrice,
      meetings,
      contractDocuments,
      userId,
      customerId,
      carId,
    });

    // 결과 반환
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
