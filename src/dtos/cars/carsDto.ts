import { z } from 'zod';

export const Cars = z.object({
  id: z.number().int().nonnegative(), // 차량 고유 ID
  carNumber: z.string().min(1).max(20), // 차량 번호
  manufacturingYear: z
    .number()
    .int()
    .nonnegative()
    .lte(new Date().getFullYear()), // 제조년도
  mileage: z.number().int().nonnegative(), // 주행거리
  price: z.number().int().nonnegative(), // 가격
  accidentCount: z.number().int().nonnegative(), // 사고 횟수
  explanation: z.string(), // 차량 설명
  accidentDetails: z.string(), // 사고 상세
  status: z.enum(['possession', 'contractProceeding', 'contractCompleted']), // 계약 상태 (보유 중 | 계약 진행 중 | 계약 완료)
  modelId: z.number().int().nonnegative(), // 모델 ID
  carModel: z.object({
    id: z.number().int().nonnegative(), // 모델 고유 ID
    model: z.string().min(1), // 차종
    type: z.enum(['SUV', '세단', '경차']), // 차종 타입
    manufacturer: z.string().min(1), // 제조사
  }),
});
