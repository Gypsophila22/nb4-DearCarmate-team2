import { z } from 'zod';

import { createCarModelRepository } from '../../repositories/cars/createCarModelsRepository.js';
import { createCarRepository } from '../../repositories/cars/createCarsRepository.js';
import { findCarModelRepository } from '../../repositories/cars/findCarModelRepository.js';

import type { CreateCarRequestDto } from '../../dtos/cars/createCarsRequestDto.js';

/**
 * 차량 생성 Service
 */
export const createCarService = async (
  data: z.infer<typeof CreateCarRequestDto>,
) => {
  // 차량 모델 조회
  let carModel = await findCarModelRepository.findByManufacturerAndModel(
    data.manufacturer,
    data.model,
  );

  // 모델이 없으면 생성
  if (!carModel) {
    carModel = await createCarModelRepository.create({
      manufacturer: data.manufacturer, // 제조사
      model: data.model, // 차량 이름
      type: '세단', // 기본값 세단
    });
  }

  // 모델 id 넣어서 차량 데이터 생성
  return createCarRepository.create({
    carNumber: data.carNumber,
    manufacturingYear: data.manufacturingYear,
    mileage: data.mileage,
    price: data.price,
    accidentCount: data.accidentCount,
    explanation: data.explanation,
    accidentDetails: data.accidentDetails,
    modelId: carModel.id,
    status: 'possession',
  });
};
