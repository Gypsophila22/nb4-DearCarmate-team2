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
      type,
      manufacturingYear,
      mileage,
      price,
      accidentCount,
      explanation,
      accidentDetails,
    } = req.body;

    if (!carId || isNaN(Number(carId))) {
      return res.status(400).json({ message: '잘못된 요청입니다' });
    }

    const car = await prisma.cars.findUnique({
      where: { id: Number(carId) },
      include: { carModel: true },
    });

    if (!car) {
      return res.status(404).json({ message: '존재하지 않는 차량입니다' });
    }

    let modelId = car.modelId; // 기본값: 기존 모델 ID

    // 제조사/모델/타입 변경이 있으면 새 CarModel 처리
    if (manufacturer || model || type) {
      const existingCarModel = await prisma.carModel.findFirst({
        where: {
          manufacturer: manufacturer ?? car.carModel.manufacturer,
          model: model ?? car.carModel.model,
          type: type ?? car.carModel.type,
        },
      });

      if (existingCarModel) {
        modelId = existingCarModel.id;
      } else {
        const newCarModel = await prisma.carModel.create({
          data: {
            manufacturer: manufacturer ?? car.carModel.manufacturer,
            model: model ?? car.carModel.model,
            type: type ?? car.carModel.type,
          },
        });
        modelId = newCarModel.id;
      }
    }

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
