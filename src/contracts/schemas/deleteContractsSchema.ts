import { z } from 'zod';

export const DeleteContractSchema = z.object({
  contractId: z
    .string()
    .regex(/^\d+$/, '유효한 숫자여야 합니다')
    .transform(Number),
});
