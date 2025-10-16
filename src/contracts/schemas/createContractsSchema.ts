import { z } from 'zod';

export const CreateContractSchema = z.object({
  carId: z.number(), // 차량 ID
  customerId: z.number(), // 고객 ID
  meetings: z.array(
    z.object({
      date: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: '유효한 날짜 문자열이어야 합니다',
      }), // ISO 날짜 문자열
      alarms: z.array(
        z.string().refine((val) => !isNaN(Date.parse(val)), {
          message: '알람은 유효한 날짜 문자열이어야 합니다',
        }),
      ),
    }),
  ),
});
