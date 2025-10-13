import prisma from '../../config/prisma.js';

import type { Request, Response } from 'express';
// TODO: 정리
export const getCarByIdController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const { carId } = req.params;

    // carId 검증
    if (!carId || isNaN(Number(carId))) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 차량 조회 (carModel 관계 포함)
    const car = await prisma.cars.findUnique({
      where: { id: Number(carId) },
      include: {
        carModel: true,
      },
    });

    if (!car) {
      return res.status(404).json({ message: '존재하지 않는 차량입니다' });
    }

    // 조회 결과 반환
    res.status(200).json({
      id: car.id,
      carNumber: car.carNumber,
      manufacturer: car.carModel.manufacturer,
      model: car.carModel.model,
      type: car.carModel.type,
      manufacturingYear: car.manufacturingYear,
      mileage: car.mileage,
      price: car.price,
      accidentCount: car.accidentCount,
      explanation: car.explanation,
      accidentDetails: car.accidentDetails,
      status: car.status,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
