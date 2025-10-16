import { z } from 'zod';

const param = z.object({
  contractId: z
    .string()
    .regex(/^\d+$/, '유효한 숫자여야 합니다')
    .transform(Number),
});
const body = z.object({
  status: z.enum([
    'carInspection',
    'priceNegotiation',
    'contractDraft',
    'contractSuccessful',
    'contractFailed',
  ]),
  resolutionDate: z.string(),
  contractPrice: z.number(),
  meetings: z.array(
    z.object({ date: z.string(), alarms: z.array(z.string()) }),
  ),
  contractDocuments: z.array(
    z.object({
      id: z.number().int().positive(),
      fileName: z.string().min(1),
    }),
  ),
  userId: z.number().int().positive(),
  customerId: z.number().int().positive(),
  carId: z.number().int().positive(),
});

export const UpdateContractSchema = {
  param,
  body,
};
