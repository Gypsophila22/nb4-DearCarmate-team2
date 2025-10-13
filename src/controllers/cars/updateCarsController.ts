import prisma from '../../config/prisma.js';

import type { Request, Response } from 'express';
// TODO: 정리
export const updateCarsController = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }

    const { carId } = req.params;
    const {
      carNumber,
      manufacturer,
      model,
      manufacturingYear,
      mileage,
      price,
      accidentCount,
      explanation,
      accidentDetails,
    } = req.body; // 요청 본문에서 업데이트 데이터 추출

    if (!carId || isNaN(Number(carId))) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    // 차량 정보 조회
    const car = await prisma.cars.findUnique({
      where: { id: Number(carId) },
      include: { carModel: true },
    });

    if (!car) {
      return res.status(404).json({ message: '존재하지 않는 차량입니다' });
    }

    let modelId = car.modelId; // 기본값: 기존 모델 ID

    // 제조사/모델 변경이 있으면 모델이 존재하는지 확인 후 없으면 새 CarModel 처리
    if (
      (manufacturer && manufacturer !== car.carModel.manufacturer) ||
      (model && model !== car.carModel.model)
    ) {
      // 변경된 제조사/모델 조합이 이미 존재하는 CarModel인지 확인
      const existingCarModel = await prisma.carModel.findUnique({
        where: {
          manufacturer_model: {
            manufacturer: manufacturer ?? car.carModel.manufacturer,
            model: model ?? car.carModel.model,
          },
        },
      });

      if (existingCarModel) {
        // 기존 CarModel이 있으면 해당 ID 사용
        modelId = existingCarModel.id;
      } else {
        // 없으면 새로운 CarModel 생성 후 ID 사용
        const newCarModel = await prisma.carModel.create({
          data: {
            manufacturer: manufacturer ?? car.carModel.manufacturer,
            model: model ?? car.carModel.model,
            type: car.carModel.type, // 기존 차량의 type 유지
          },
        });
        modelId = newCarModel.id;
      }
    }

    // Cars 테이블 업데이트
    const updatedCar = await prisma.cars.update({
      where: { id: Number(carId) },
      data: {
        carNumber,
        manufacturingYear,
        mileage,
        price,
        accidentCount,
        explanation,
        accidentDetails,
        modelId,
      },
      include: { carModel: true },
    });

    // 업데이트 결과 반환
    res.status(200).json({
      id: updatedCar.id,
      carNumber: updatedCar.carNumber,
      manufacturer: updatedCar.carModel.manufacturer,
      model: updatedCar.carModel.model,
      type: updatedCar.carModel.type,
      manufacturingYear: updatedCar.manufacturingYear,
      mileage: updatedCar.mileage,
      price: updatedCar.price,
      accidentCount: updatedCar.accidentCount,
      explanation: updatedCar.explanation,
      accidentDetails: updatedCar.accidentDetails,
      status: updatedCar.status,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
