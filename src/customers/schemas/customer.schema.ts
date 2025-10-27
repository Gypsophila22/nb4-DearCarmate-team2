import { z } from 'zod';
import { Gender, Region, AgeGroup } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { ageGroupMap } from '../../enums/customer.enums.js';

const ageGroupSchema = z
  .union([
    z.nativeEnum(AgeGroup),
    z.string().transform((val, ctx) => {
      if (!val) return z.NEVER;

      const mappedEnumKey = Object.keys(ageGroupMap).find(
        (key) => ageGroupMap[key as AgeGroup] === val,
      );
      if (mappedEnumKey) {
        return mappedEnumKey as AgeGroup;
      }

      const match = val.match(/^(\d{1,2})-(\d{1,2})$/);
      if (match) {
        const startDecade = parseInt(match[1], 10);
        const koreanAgeGroup = `${startDecade}대`;
        const mappedEnumKeyFromRange = Object.keys(ageGroupMap).find(
          (key) => ageGroupMap[key as AgeGroup] === koreanAgeGroup,
        );
        if (mappedEnumKeyFromRange) {
          return mappedEnumKeyFromRange as AgeGroup;
        }
      }

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '유효하지 않은 연령대 형식입니다. (예: "10대" 또는 "10-20")',
        path: [],
      });
      return z.NEVER;
    }),
  ])
  .optional();

const getCustomersSchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    pageSize: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
    searchBy: z.enum(['name', 'email']).optional(),
    keyword: z.string().optional(),
  })
  .strict();

const createCustomerSchema = z
  .object({
    name: z.string().min(1, { message: '고객명은 필수입니다.' }),
    gender: z.nativeEnum(Gender),
    phoneNumber: z.string().min(1, { message: '연락처는 필수입니다.' }),
    ageGroup: ageGroupSchema,
    region: z.nativeEnum(Region).optional(),
    email: z
      .string()
      .email({ message: '유효하지 않은 이메일 형식입니다.' })
      .optional(),
    memo: z.string().optional(),
  })
  .strict();

const updateCustomerParamsSchema = z
  .object({
    id: z.coerce.number(),
  })
  .strict();
const updateCustomerBodySchema = z.object({
  name: z.string().min(1, { message: '고객명은 필수입니다.' }).optional(),
  gender: z.nativeEnum(Gender).optional(),
  phoneNumber: z
    .string()
    .min(1, { message: '연락처는 필수입니다.' })
    .optional(),
  ageGroup: ageGroupSchema,
  region: z.nativeEnum(Region).optional(),
  email: z
    .string()
    .email({ message: '유효하지 않은 이메일 형식입니다.' })
    .optional(),
  memo: z.string().optional(),
});

const deleteCustomerSchema = z
  .object({
    id: z.coerce.number(),
  })
  .strict();

const getCustomerByIdSchema = z
  .object({
    id: z.coerce.number(),
  })
  .strict();

export const customerCsvRowSchema = z
  .object({
    name: z.string().min(1, '고객명은 필수입니다.'),
    email: z.string().email('유효하지 않은 이메일 형식입니다.').optional(),
    gender: z.nativeEnum(Gender),
    phoneNumber: z
      .string()
      .regex(
        /^\d{2,4}-\d{3,4}-\d{4}$|^\d{9,11}$/,
        '유효한 연락처 형식이 아닙니다.',
      ),
    region: z.nativeEnum(Region).optional(),
    ageGroup: ageGroupSchema,
    memo: z.string().optional(),
  })
  .strict();

class CustomerValidation {
  getCustomers(req: Request, res: Response, next: NextFunction) {
    const result = getCustomersSchema.safeParse(req.query);
    if (result.success) {
      res.locals.query = result.data;
      return next();
    }
    return next(createError(400, '잘못된 입력값입니다.'));
  }

  createCustomer(req: Request, res: Response, next: NextFunction) {
    const result = createCustomerSchema.safeParse(req.body);
    if (result.success) {
      res.locals.body = result.data;
      return next();
    }
    console.error('Zod Create Customer Validation Error:', result.error.issues);
    return next(createError(400, '잘못된 입력값입니다.'));
  }

  updateCustomer(req: Request, res: Response, next: NextFunction) {
    const paramsResult = updateCustomerParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return next(createError(400, '잘못된 URL 파라미터입니다.'));
    }

    const bodyResult = updateCustomerBodySchema.safeParse(req.body);
    if (!bodyResult.success) {
      console.error('Zod Body Validation Error:', bodyResult.error.issues);
      return next(createError(400, '잘못된 요청 본문입니다.'));
    }

    res.locals.params = paramsResult.data;
    res.locals.body = bodyResult.data;
    return next();
  }

  deleteCustomer(req: Request, res: Response, next: NextFunction) {
    const result = deleteCustomerSchema.safeParse(req.params);
    if (result.success) {
      res.locals.params = result.data;
      return next();
    }
    return next(createError(400, '잘못된 입력값입니다.'));
  }

  getCustomerById(req: Request, res: Response, next: NextFunction) {
    const result = getCustomerByIdSchema.safeParse(req.params);
    if (result.success) {
      res.locals.params = result.data;
      return next();
    }
    return next(createError(400, '잘못된 입력값입니다.'));
  }
}

export const customerValidation = new CustomerValidation();
