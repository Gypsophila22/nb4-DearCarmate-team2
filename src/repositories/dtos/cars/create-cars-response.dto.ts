import { z } from 'zod';

import { Car } from './cars.dto.js';

/**
 * 차량 생성 응답 DTO
 *
 * - Car 기본 DTO에서 modelId, carModel 제거
 * - carModel 안의 manufacturer, model, type을 추가
 */
export const CreateCarResponseDto = Car.omit({
  modelId: true,
  carModel: true,
}).extend({
  manufacturer: z.string(),
  model: z.string(),
  type: z.string(),
});
