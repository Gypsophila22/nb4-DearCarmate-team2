import prisma from '../../lib/prisma.js';
import type { Cars } from '@prisma/client';
/**
 * 주어진 차량 번호 배열로 DB에서 이미 존재하는 차량 조회
 * @param carNumbers
 * @returns 존재하는 차량 배열
 */

export const findManyByCarNumbers = async (
  carNumbers: string[],
): Promise<Cars[]> => {
  if (carNumbers.length === 0) return [];
  return prisma.cars.findMany({
    where: {
      carNumber: {
        in: carNumbers,
      },
    },
  });
};
