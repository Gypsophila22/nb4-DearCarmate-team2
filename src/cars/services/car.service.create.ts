import { z } from 'zod';

import { createCarsModelRepository } from '../repositories/createCarModelsRepository.js';
import { createCarsRepository } from '../repositories/createCarsRepository.js';
import { findCarModelRepository } from '../repositories/findCarModelRepository.js';

import type { CreateCarsRequestDto } from '../dtos/createCarsRequestDto.js';

/**
 * 차량 생성 Service
 */
export const createCarsService = async (
  data: z.infer<typeof CreateCarsRequestDto>,
) => {
  // 차량 모델 조회
  let carModel = await findCarModelRepository.findByManufacturerAndModel(
    data.manufacturer,
    data.model,
  );

  // 모델이 없으면 생성
  if (!carModel) {
    carModel = await createCarsModelRepository.create({
      manufacturer: data.manufacturer, // 제조사
      model: data.model, // 차량 이름
      type: '세단', // 기본값 세단
    });
  }

  // 모델 id 넣어서 차량 데이터 생성
  return createCarsRepository.create({
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
    status: 'possession',
  });
};
