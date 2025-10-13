import { z } from 'zod';

export const GetCarsListRequestDto = z.object({
  page: z // 현재 페이지 번호 (기본값 1)
    .string()
    .optional()
    .transform((val) => Number(val) || 1),
  pageSize: z // 페이지당 아이템 수 (기본값 10)
    .string()
    .optional()
    .transform((val) => Number(val) || 10),
  status: z // 차량 상태 (보유 중 | 계약 진행 중 | 계약 완료)
    .enum(['possession', 'contractProceeding', 'contractCompleted'])
    .optional(),
  searchBy: z.enum(['carNumber', 'model']).optional(), // 검색 기준
  keyword: z.string().optional(), // 검색어
});
