import { z } from "zod";

import type { Cars } from "../../../generated/prisma/index.js";
import type { CreateCarsResponseDto } from "../../auth/dtos/cars/createCarsResponseDto.js";

/**
 * Cars 객체와 관련 carModel(제조사, 모델명, 타입) 정보를 받아
 * CreateCarResponseDto 타입에 맞게 응답 구조 변환 함수
 */

export const createCarsSerialize = (
  car: Cars & {
    carModel: { id: number; type: string; manufacturer: string; model: string };
  }
): z.infer<typeof CreateCarsResponseDto> => ({
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
