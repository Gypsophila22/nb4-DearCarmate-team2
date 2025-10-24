import createError from 'http-errors';

import { CarType } from '@prisma/client';

import { carRepository } from '../repositories/car.repository.js';
import type { UpdateCar } from '../repositories/types/car.types.js';

export const carUpdateService = async (carId: number, data: UpdateCar) => {
  // 차량 정보 조회
  const car = await carRepository.getCarByIdWithModel(carId);
  if (!car) {
    throw createError(404, '존재하지 않는 차량입니다');
  }

  let modelId = car.modelId; // 기본값: 기존 모델 ID

  // 제조사/모델 변경이 있으면 모델이 존재하는지 확인 후 없으면 새 CarModel 처리

  // 문자열이면서 기존과 다를때
  const manufacturerChanged =
    typeof data.manufacturer === 'string' &&
    data.manufacturer !== car.carModel.manufacturer;

  const modelChanged =
    typeof data.model === 'string' && data.model !== car.carModel.model;

  if (manufacturerChanged || modelChanged) {
    const manufacturer = data.manufacturer ?? car.carModel.manufacturer;
    const model = data.model ?? car.carModel.model;
    // 변경된 제조사/모델 조합이 이미 존재하는 CarModel인지 확인
    const existingCarModel = await carRepository.findByManufacturerAndModel({
      manufacturer,
      model,
    });

    if (existingCarModel) {
      // 기존 CarModel이 있으면 해당 ID 사용
      modelId = existingCarModel.id;
    } else {
      // 없으면 새로운 CarModel 생성 후 ID 사용
      if (!data.manufacturer || !data.model) {
        throw createError(400, '필수 필드가 누락되었습니다');
      }
      const newCarModel = await carRepository.createModel({
        manufacturer: data.manufacturer,
        model: data.model,
        type: CarType.세단, // 생성할때 타입 기본으로 세단 지정
      });
      modelId = newCarModel.id; // 새로 생성된 모델의 id로 덮어씀
    }
  }

  const updateData = {
    carNumber: data.carNumber,
    manufacturingYear: data.manufacturingYear,
    mileage: data.mileage,
    price: data.price,
    accidentCount: data.accidentCount,
    explanation: data.explanation,
    accidentDetails: data.accidentDetails,
    modelId,
  };

  // Cars 테이블 업데이트
  try {
    const updatedCar = await carRepository.update({ carId, updateData });
    // 업데이트 결과 반환
    return updatedCar;
  } catch (err) {
    if (err.code === 'P2002') {
      throw createError(409, `차량 번호 ${data.carNumber}는 이미 존재합니다.`);
    }
    throw err;
  }
};
