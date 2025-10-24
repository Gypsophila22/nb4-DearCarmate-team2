import createError from 'http-errors';

import type { NextFunction, Request, Response } from 'express';
import contractService from '../services/index.js';

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
      const contractId = Number(req.params.contractId);

      if (!req.user) throw createError(401, '로그인이 필요합니다.');
      const userId = req.user.id;

      await contractService.delete({ contractId, userId });
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
      // searchBy를 'customerName' | 'userName' 타입으로 좁힘
      let searchBy: 'customerName' | 'userName' | undefined;
      if (
        req.query.searchBy === 'customerName' ||
        req.query.searchBy === 'userName'
      ) {
        searchBy = req.query.searchBy;
      } else {
        searchBy = undefined; // 없으면 undefined로 처리
      }

      // keyword는 string인지 체크
      const keyword =
        typeof req.query.keyword === 'string' ? req.query.keyword : undefined;

      const result = await contractService.getList({ searchBy, keyword });

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

      const contractId = Number(req.params.contractId);

      // 계약 업데이트 서비스 호출
      const result = await contractService.update({
        userId: req.user.id,
        contractId: contractId,
        data: req.body,
      });

      // 결과 반환
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}
export const contractController = new ContractController();
