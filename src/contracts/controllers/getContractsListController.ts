import contractService from '../services/index.js';

import type { NextFunction, Request, Response } from 'express';

// 계약 목록 조회 컨트롤러
export const getContractsListController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { searchBy, keyword } = req.query as {
      searchBy?: string; // 고객 이름 | 담당자 이름 (검색 기준)
      keyword?: string; // 검색어
    };
    // TODO: 쿼리 검증 추가하기

    // 계약 목록 조회 서비스 호출
    const result = await contractService.getContractsList(searchBy, keyword);

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
