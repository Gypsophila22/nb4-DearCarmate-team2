import createError from 'http-errors';
import { z } from 'zod';

import type { Request, Response, NextFunction } from 'express';

const Cars = z
  .object({
    id: z.coerce.number().int().nonnegative(), // 차량 고유 ID
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

const UpdateBody = Cars.omit({
  id: true,
  status: true,
  modelId: true,
  carModel: true,
}).strict();

export const CreateCars = Cars.omit({
  id: true,
  status: true, // 계약 상태
  modelId: true, // 차종 모델 id
  carModel: true, // 차종 테이블 연결
})
  .extend({
    manufacturer: z.string().min(1), // 제조사
    model: z.string().min(1), // 차종 이름
  })
  .strict();

export const GetCarsListParams = z
  .object({
    page: z.coerce // 현재 페이지 번호 (기본값 1)
      .number()
      .optional()
      .default(1),
    pageSize: z.coerce // 페이지당 아이템 수 (기본값 10)
      .number()
      .optional()
      .default(10),
    status: z // 차량 상태 (보유 중 | 계약 진행 중 | 계약 완료)
      .enum(['possession', 'carProceeding', 'carCompleted'])
      .optional(),
    searchBy: z.enum(['carNumber', 'model']).optional(), // 검색 기준
    keyword: z.string().optional(), // 검색어
  })
  .strict();

class CarSchema {
  // 차량 생성
  create(req: Request, _res: Response, next: NextFunction) {
    const result = CreateCars.safeParse(req.body);

    if (!result.success) {
      return next(createError(400, '잘못된 요청입니다'));
    } else {
      req.body = result.data;
      return next();
    }
  }
  // 차량 수정
  update(req: Request, _res: Response, next: NextFunction) {
    const paramResult = CarIdParam.safeParse(req.params);
    const bodyResult = UpdateBody.safeParse(req.body);

    if (!paramResult.success || !bodyResult.success) {
      return next(createError(400, '잘못된 요청입니다'));
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
    const result = GetCarsListParams.safeParse(req.query);
    if (!result.success) {
      return next(createError(400, '잘못된 요청입니다'));
    } else {
      return next();
    }
  }
}

export const carSchema = new CarSchema();
