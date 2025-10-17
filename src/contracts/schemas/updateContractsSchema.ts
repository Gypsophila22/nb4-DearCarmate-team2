import { z } from 'zod';

const param = z.object({
  contractId: z
    .string()
    .regex(/^\d+$/, '유효한 숫자여야 합니다')
    .transform(Number),
});
const body = z.object({
  status: z
    .enum([
      'carInspection',
      'priceNegotiation',
      'contractDraft',
      'contractSuccessful',
      'contractFailed',
    ])
    .optional(),
  resolutionDate: z.string().optional(),
  contractPrice: z.number().optional(),
  meetings: z
    .array(
      z.object({ date: z.string(), alarms: z.array(z.string()) }).optional(),
    )
    .optional(),
  contractDocuments: z
    .array(
      z
        .object({
          id: z.number().int().positive(),
          fileName: z.string().min(1),
        })
        .optional(),
    )
    .optional(),
  userId: z.number().int().positive().optional(),
  customerId: z.number().int().positive().optional(),
  carId: z.number().int().positive().optional(),
});

export const UpdateContractSchema = {
  param,
  body,
};
