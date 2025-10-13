import { z } from 'zod';

import { Cars } from './carsDto.js';

/**
 * Cars 모델의 관계 CarModel 의 데이터
 * (manufacturer, model, type)를 문자열 형태로 포함
 */
export const CarsResponseDto = Cars.omit({
  modelId: true,
  carModel: true,
}).extend({
  manufacturer: z.string(), // 제조사 이름
  model: z.string(), // 모델 (차량) 이름
  type: z.string(), // 차량 타입 (세단, SUV, 경차)
});
