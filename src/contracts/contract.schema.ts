import createError from "http-errors";
import { z } from "zod";

import type { Request, Response, NextFunction } from "express";

// 계약 id 파라미터
export const ContractIdParamSchema = z
  .object({
    contractId: z.coerce.number(),
  })
  .strict();

// 계약 생성 바디
export const ContractCreateBodySchema = z.object({
  carId: z.coerce.number(), // 차량 ID
  customerId: z.coerce.number(), // 고객 ID
  meetings: z.array(
    z.object({
      date: z.coerce.date(),
      alarms: z.array(z.coerce.date()),
    }),
  ),
});

// 계약 수정 바디
export const ContractUpdateBodySchema = z
  .object({
    status: z
      .enum([
        "carInspection", // 차량 확인
        "priceNegotiation", // 가격 협의
        "contractDraft", // 계약서 작성 중
        "contractSuccessful", // 계약 성공
        "contractFailed", // 계약 실패
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
    userId: z.coerce.number().optional(),
    customerId: z.coerce.number().optional(),
    carId: z.coerce.number().optional(),
  })
  .strict();

class ContractSchema {
  // 계약 생성
  create(req: Request, _res: Response, next: NextFunction) {
    const result = ContractCreateBodySchema.safeParse(req.body);

    if (!result.success) {
      return next(createError(400, "잘못된 요청입니다"));
    } else {
      req.body = result.data;
      return next();
    }
  }

  // 계약 수정
  update(req: Request, _res: Response, next: NextFunction) {
    const paramResult = ContractIdParamSchema.safeParse(req.params);
    const bodyResult = ContractUpdateBodySchema.safeParse(req.body);

    if (!paramResult.success || !bodyResult.success) {
      return next(createError(400, "잘못된 요청입니다"));
    } else {
      req.body = bodyResult.data;
      return next();
    }
  }

  // 계약 삭제
  delete(req: Request, _res: Response, next: NextFunction) {
    const result = ContractIdParamSchema.safeParse(req.params);

    if (!result.success) {
      return next(createError(400, "잘못된 요청입니다"));
    } else {
      return next();
    }
  }
}

export const contractSchema = new ContractSchema();
