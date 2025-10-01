import { z } from 'zod';

import { Car } from './cars.dto.js';

/**
 * 차량 추가 요청 DTO
 */
export const CreateCarRequestDto = Car.omit({
  id: true,
  status: true, // 계약 상태
  modelId: true, // 차종 모델 id
  carModel: true, // 차종 테이블 연결
}).extend({
  manufacturer: z.string().min(1), // 제조사
  model: z.string().min(1), // 차종 이름
});
