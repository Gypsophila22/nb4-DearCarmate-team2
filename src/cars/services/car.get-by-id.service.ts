import createError from 'http-errors';

import { carRepository } from '../car.repository.js';

export const carGetByIdService = async (carId) => {
  const car = carRepository.getCarByIdWithModel(carId);
  if (!car) {
    throw createError(404, '존재하지 않는 차량입니다');
  }
  return car;
};
