import prisma from '../../lib/prisma.js';

import type { Request, Response } from 'express';
// TODO: 정리
export const deleteCarController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const { carId } = req.params;

    // carId 검증
    if (!carId || isNaN(Number(carId))) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    //carId가 붙어있는지 체크하는건 여기서 해도 상관 없을 것 같은데, prisma 관련 코드는 레포지토리로 떼주세요
    // 차량 존재 여부 확인
    const car = await prisma.cars.findUnique({
      where: { id: Number(carId) },
    });
    if (!car) {
      return res.status(404).json({ message: '존재하지 않는 차량입니다' });
    }

    // 차량 삭제
    await prisma.cars.delete({
      where: { id: Number(carId) },
    });

    res.status(200).json({ message: '차량 삭제 성공' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
