import { z } from 'zod';
import { Gender, Region, AgeGroup } from '@prisma/client';
import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';

export const getCustomersSchema = z.object({
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
});

export const createCustomerSchema = z.object({
  name: z.string().min(1, { message: '고객명은 필수입니다.' }),
  gender: z.nativeEnum(Gender),
  phoneNumber: z.string().min(1, { message: '연락처는 필수입니다.' }),
  ageGroup: z.string().optional(),
  region: z.string().optional(),
  email: z
    .string()
    .email({ message: '유효하지 않은 이메일 형식입니다.' })
    .optional(),
  memo: z.string().optional(),
});

export const updateCustomerParamsSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});
export const updateCustomerBodySchema = z.object({
  name: z.string().min(1).optional(),
  gender: z.nativeEnum(Gender).optional(),
  phoneNumber: z.string().min(1).optional(),
  ageGroup: z.string().optional(),
  region: z.string().optional(),
  email: z.string().email().optional(),
  memo: z.string().optional(),
});

export const deleteCustomerSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

export const getCustomerByIdSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)),
});

export const customerCsvRowSchema = z.object({
  name: z.string().min(1, '고객명은 필수입니다.'),
  email: z.string().email('유효하지 않은 이메일 형식입니다.').optional(),
  gender: z.enum(['male', 'female'], {
    message: '성별은 male 또는 female이어야 합니다.',
  }),
  phoneNumber: z
    .string()
    .regex(
      /^\d{2,4}-\d{3,4}-\d{4}$|^\d{9,11}$/,
      '유효한 연락처 형식이 아닙니다.',
    ),
  region: z.string().optional(),
  ageGroup: z.string().optional(),
  memo: z.string().optional(),
});

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
    return next(createError(400, '잘못된 입력값입니다.'));
  }

  updateCustomer(req: Request, res: Response, next: NextFunction) {
    const paramsResult = updateCustomerParamsSchema.safeParse(req.params);
    if (!paramsResult.success) {
      return next(createError(400, '잘못된 URL 파라미터입니다.'));
    }

    const bodyResult = updateCustomerBodySchema.safeParse(req.body);
    if (!bodyResult.success) {
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

export type GetCustomersQuery = z.infer<typeof getCustomersSchema>;
export type CreateCustomerBody = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerParams = z.infer<typeof updateCustomerParamsSchema>;
export type UpdateCustomerBody = z.infer<typeof updateCustomerBodySchema>;
export type DeleteCustomerParams = z.infer<typeof deleteCustomerSchema>;
export type GetCustomerByIdParams = z.infer<typeof getCustomerByIdSchema>;
export type CustomerCsvRow = z.infer<typeof customerCsvRowSchema>;

export type TransformedCreateCustomerData = Omit<
  CreateCustomerBody,
  'ageGroup' | 'region'
> & {
  ageGroup?: AgeGroup;
  region?: Region;
};

export type TransformedUpdateCustomerData = Omit<
  UpdateCustomerBody,
  'ageGroup' | 'region'
> & {
  ageGroup?: AgeGroup;
  region?: Region;
};

export type TransformedCustomerCsvRow = Omit<
  CustomerCsvRow,
  'ageGroup' | 'region'
> & {
  ageGroup?: AgeGroup;
  region?: Region;
};
