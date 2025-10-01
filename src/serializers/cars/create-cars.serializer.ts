import { z } from 'zod';

import type { Cars } from '../../../generated/prisma/index.js';
import type { CreateCarResponseDto } from '../../dtos/cars/create-cars-response.dto.js';

export const createCarSerialize = (
  car: Cars & {
    carModel: { id: number; type: string; manufacturer: string; model: string };
  },
): z.infer<typeof CreateCarResponseDto> => ({
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
