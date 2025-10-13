import prisma from '../../config/prisma.js';

import type { Request, Response } from 'express';
/**
 * 차량 모델 목록 조회 컨트롤러
 */
// TODO: 정리
export const getCarModelsController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    // TODO: CarModel 접근할 때 carModel로 하기 때문에 Cars 테이블의 관계 필드와 헷갈림 (수정필요)
    // DB에서 모든 차량 모델과 제조사 조회(CarModel 테이블))
    const models = await prisma.carModel.findMany();

    // 제조사별로 모델 그룹화
    const grouped = models.reduce((acc, curr) => {
      // 기존 그룹에 제조사가 존재하는지 확인
      const existing = acc.find(
        (item) => item.manufacturer === curr.manufacturer,
      );
      // 존재하면 모델 리스트에 추가
      if (existing) {
        existing.model.push(curr.model);
      } else {
        // 없으면 새 그룹 생성
        acc.push({ manufacturer: curr.manufacturer, model: [curr.model] });
      }
      return acc;
    }, [] as { manufacturer: string; model: string[] }[]);

    // 데이터 반환
    res.status(200).json({ data: grouped });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
