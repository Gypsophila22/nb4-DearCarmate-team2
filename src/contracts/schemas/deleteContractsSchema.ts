import { z } from 'zod';

export const DeleteContractSchema = z.object({
  contractId: z
    .string() // 기본적으로 string
    .regex(/^\d+$/, '유효한 숫자여야 합니다') // 숫자 문자열 확인
    .transform(Number), // string -> number 변환
});
