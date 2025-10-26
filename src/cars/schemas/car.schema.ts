import { CarStatus } from '@prisma/client';
import { z, ZodError } from 'zod';

import type { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';
const Cars = z
  .object({
    id: z.coerce.number().int().nonnegative(), // 차량 고유 ID
    carNumber: z.string().min(1).max(20), // 차량 번호
    manufacturingYear: z
      .number()
      .int()
      .nonnegative()
      .lte(new Date().getFullYear()), // 제조년도 (현재 연도 이하)
    mileage: z.number().int().nonnegative().lte(1_000_000), // 주행거리
    price: z.number().int().nonnegative().lte(1_000_000_000), // 가격
    accidentCount: z.number().int().nonnegative().lte(100), // 사고 횟수
    explanation: z.string().default(''), // 차량 설명
    accidentDetails: z.string().default(''), // 사고 상세
    status: z.enum(['possession', 'carProceeding', 'carCompleted']), // 계약 상태 (보유 중 | 계약 진행 중 | 계약 완료)
    modelId: z.number().int().nonnegative(), // 모델 ID
    carModel: z.object({
      id: z.number().int().nonnegative(), // 모델 고유 ID
      model: z.string().min(1), // 차종
      type: z.enum(['SUV', '세단', '경차']), // 차종 타입
      manufacturer: z.string().min(1), // 제조사
    }),
  })
  .strict();

// 계약 id 파라미터
export const CarIdParam = z
  .object({
    carId: z.coerce.number(),
  })
  .strict();

const UpdateCarBody = Cars.extend({
  manufacturer: z.string().min(1).optional(),
  model: z.string().min(1).optional(),
  explanation: z.string().optional(),
  accidentDetails: z.string().optional(),
})
  .partial()
  .strict();

const CreateCars = Cars.omit({
  id: true,
  status: true, // 계약 상태
  modelId: true, // 차종 모델 id
  carModel: true, // 차종 테이블 연결
})
  .extend({
    manufacturer: z.string().min(1),
    model: z.string().min(1),
    explanation: z.string().default(''),
    accidentDetails: z.string().default(''),
  })
  .strict();

export const CsvUploadCreateCar = Cars.omit({
  id: true,
  status: true,
  modelId: true,
  carModel: true,
})
  .extend({
    manufacturer: z.string().min(1),
    model: z.string().min(1),
    manufacturingYear: z.coerce.number().int().nonnegative(),
    mileage: z.coerce.number().int().nonnegative(),
    price: z.coerce.number().int().nonnegative(),
    accidentCount: z.coerce.number().int().nonnegative().default(0),
  })
  .strict();

export const GetCarsListQuery = z
  .object({
    page: z.coerce.number().optional().default(1), // 현재 페이지 번호 (기본값 1)
    pageSize: z.coerce.number().optional().default(10), // 페이지당 아이템 수 (기본값 10)
    status: z.enum(CarStatus).optional(), // 차량 상태 (보유 중 | 계약 진행 중 | 계약 완료)
    searchBy: z.enum(['carNumber', 'model']).optional(), // 검색 기준
    keyword: z.string().optional(), // 검색어
  })
  .strict();

class CarSchema {
  // 차량 생성
  create(req: Request, _res: Response, next: NextFunction) {
    const result = CreateCars.safeParse(req.body);

    if (!result.success) {
      // safeParse 실패 시 result.error가 ZodError 객체
      const zodError = result.error as ZodError<z.infer<typeof CreateCars>>;
      const errorDetails = zodError.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return next(createError(400, `잘못된 요청입니다: ${errorDetails}`));
    } else {
      req.body = result.data;
      return next();
    }
  }
  // 차량 수정
  update(req: Request, _res: Response, next: NextFunction) {
    const paramResult = CarIdParam.safeParse(req.params);
    const bodyResult = UpdateCarBody.safeParse(req.body);

    if (!paramResult.success) {
      return next(createError(400, '잘못된 요청입니다'));
    } else if (!bodyResult.success) {
      const zodError = bodyResult.error as ZodError<
        z.infer<typeof UpdateCarBody>
      >;
      const errorDetails = zodError.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return next(createError(400, `잘못된 요청입니다: ${errorDetails}`));
    } else {
      req.body = bodyResult.data;
      return next();
    }
  }
  // 차량 삭제
  delete(req: Request, _res: Response, next: NextFunction) {
    const result = CarIdParam.safeParse(req.params);

    if (!result.success) {
      return next(createError(400, '잘못된 요청입니다'));
    } else {
      return next();
    }
  }

  // 차량 목록 조회
  getList(req: Request, _res: Response, next: NextFunction) {
    const result = GetCarsListQuery.safeParse(req.query);
    if (!result.success) {
      const zodError = result.error as ZodError<
        z.infer<typeof GetCarsListQuery>
      >;
      const errorDetails = zodError.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ');
      return next(createError(400, `잘못된 요청입니다: ${errorDetails}`));
    } else {
      return next();
    }
  }
}

export const carSchema = new CarSchema();
