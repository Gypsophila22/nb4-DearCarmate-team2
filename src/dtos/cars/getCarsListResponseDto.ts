import { z } from 'zod';

import { CarsResponseDto } from './carsResponseDto.js';

/**
 * 차량 목록 조회 응답 DTO
 */
export const GetCarsListResponseDto = z.object({
  totalPages: z.number(), // 전체 페이지 수 (전체 아이템 수 / 페이지당 아이템 수)
  totalItemCount: z.number(), // 전체 아이템 수
  data: z.array(CarsResponseDto),
});
