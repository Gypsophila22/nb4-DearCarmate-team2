import createError from 'http-errors';

import contractService from './services/index.js';

import type { NextFunction, Request, Response } from 'express';
import { ContractIdParamSchema } from './contract.schema.js';

class ContractController {
  create = async (req: Request, res: Response, next: NextFunction) => {
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

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paramResult = ContractIdParamSchema.safeParse(req.params);
      if (!paramResult.success) throw createError(400, '잘못된 계약 ID입니다');
      const { contractId } = paramResult.data;

      if (!req.user) throw createError(401, '로그인이 필요합니다.');

      await contractService.delete(contractId, req.user.id);
      return res.status(200).json({ message: '계약 삭제 성공' });
    } catch (err) {
      next(err);
    }
  };

  getCarList = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await contractService.getCarsListForContract();
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { searchBy, keyword } = req.query as {
        searchBy?: 'customerName' | 'userName'; // 고객 이름 | 담당자 이름 (검색 기준)
        keyword?: string; // 검색어
      };

      // 계약 목록 조회 서비스 호출 TODO: 쿼리 검증 추가
      const result = await contractService.getList(searchBy, keyword);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // 계약용 고객 목록 조회 컨트롤러
  customersList = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await contractService.getCustomersListForContract();
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  usersList = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await contractService.getUsersListForContract();
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw createError(401, '로그인이 필요합니다.');
      const paramResult = ContractIdParamSchema.safeParse(req.params);
      if (!paramResult.success)
        throw createError(404, '존재하지 않는 계약입니다');

      const contractId = Number(paramResult.data.contractId);

      // 계약 업데이트 서비스 호출
      const result = await contractService.update(req.user.id, {
        ...req.body,
        contractId,
      });

      // 결과 반환
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
export const contractController = new ContractController();
