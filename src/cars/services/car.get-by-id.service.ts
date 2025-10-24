import createError from 'http-errors';

import { carRepository } from '../repositories/car.repository.js';

export const carGetByIdService = async (carId: number) => {
  const car = carRepository.getCarByIdWithModel(carId);
  if (!car) {
    throw createError(404, '존재하지 않는 차량입니다');
  }
  return car;
};
