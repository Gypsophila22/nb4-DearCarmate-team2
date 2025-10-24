import createError from 'http-errors';

import { CarStatus, CarType } from '@prisma/client';

import { carRepository } from '../repositories/car.repository.js';
import type { CreateCar } from '../repositories/types/car.types.js';

/**
 * 차량 생성 Service
 */
export const createCarsService = async (data: CreateCar) => {
  // 차량 모델 조회
  let carModel = await carRepository.findByManufacturerAndModel({
    ...data,
  });

  // 모델이 없으면 생성
  if (!carModel) {
    carModel = await carRepository.createModel({
      manufacturer: data.manufacturer, // 제조사
      model: data.model, // 차량 이름
      type: CarType.세단, // 기본값 세단
    });
  }

  // 모델 id 넣어서 차량 데이터 생성
  try {
    const car = await carRepository.create({
      carNumber: data.carNumber,
      manufacturingYear: data.manufacturingYear,
      mileage: data.mileage,
      price: data.price,
      accidentCount: data.accidentCount,
      explanation: data.explanation,
      accidentDetails: data.accidentDetails,
      carModel: {
        connect: { id: carModel.id },
      },
      status: CarStatus.possession, // 기본값 '보유중'
    });
    return {
      ...car,
      carModel: {
        id: carModel.id,
        type: carModel.type,
        manufacturer: carModel.manufacturer,
        model: carModel.model,
      },
    };
  } catch (err) {
    if (err.code === 'P2002') {
      throw createError(409, `차량 번호 ${data.carNumber}는 이미 존재합니다.`);
    }
    throw err;
  }
};
