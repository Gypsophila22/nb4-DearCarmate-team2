import { GetCarsListRequestDto } from '../../dtos/cars/getCarsListRequestDto.js';
import { getCarsListSerializer } from '../../serializers/cars/getCarsListSerializer.js';
import { getCarsListService } from '../../services/cars/getCarsListService.js';

import type { Request, Response } from 'express';

export const getCarsListController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    const dto = GetCarsListRequestDto.parse(req.query); // 요청 쿼리 검증
    const { cars, totalItemCount } = await getCarsListService(dto); // 차량 목록 조회 서비스 실행
    return res
      .status(201)
      .json(
        getCarsListSerializer(cars, dto.page, dto.pageSize, totalItemCount),
      ); // 조회된 차량 데이터 반환
  } catch (err: any) {
    // TODO: 노션 응답처럼 수정 필요
    return res.status(400).json({
      message: err.message || '잘못된 요청입니다',
      error: err,
    });
  }
};
