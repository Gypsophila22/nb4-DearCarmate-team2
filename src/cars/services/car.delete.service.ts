import createError from 'http-errors';

import { carRepository } from '../car.repository.js';

/**
 * 차량 삭제
 * @param carId
 */
export const carDeleteService = async (carId) => {
  // 차량 확인 레포지토리 호출
  const car = await carRepository.findCarById(carId);
  if (!car) {
    throw createError(404, '존재하지 않는 차량입니다');
  }
  // 차량 삭제
  await carRepository.delete(carId);
};
