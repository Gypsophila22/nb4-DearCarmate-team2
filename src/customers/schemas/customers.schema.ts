import { z } from 'zod';
import { Gender, Region, AgeGroup } from '@prisma/client';

export const getCustomersSchema = z.object({
  query: z.object({
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
  }),
});

export const createCustomerSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: '고객명은 필수입니다.' }),
    gender: z.nativeEnum(Gender),
    phoneNumber: z.string().min(1, { message: '연락처는 필수입니다.' }),
    ageGroup: z.nativeEnum(AgeGroup).optional(),
    region: z.nativeEnum(Region).optional(),
    email: z
      .string()
      .email({ message: '유효하지 않은 이메일 형식입니다.' })
      .optional(),
    memo: z.string().optional(),
  }),
});

export const updateCustomerSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    gender: z.nativeEnum(Gender).optional(),
    phoneNumber: z.string().min(1).optional(),
    ageGroup: z.string().optional(),
    region: z.string().optional(),
    email: z.string().email().optional(),
    memo: z.string().optional(),
  }),
});

export const deleteCustomerSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
});

export const getCustomerByIdSchema = z.object({
  params: z.object({
    id: z.string().transform((val) => parseInt(val, 10)),
  }),
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
  region: z.nativeEnum(Region).optional(),
  ageGroup: z.string().optional(),
  memo: z.string().optional(),
});

export type GetCustomersQuery = z.infer<typeof getCustomersSchema>['query'];
export type CreateCustomerBody = z.infer<typeof createCustomerSchema>['body'];
export type UpdateCustomerParams = z.infer<
  typeof updateCustomerSchema
>['params'];
export type UpdateCustomerBody = z.infer<typeof updateCustomerSchema>['body'];
export type DeleteCustomerParams = z.infer<
  typeof deleteCustomerSchema
>['params'];
export type GetCustomerByIdParams = z.infer<
  typeof getCustomerByIdSchema
>['params'];
export type CustomerCsvRow = z.infer<typeof customerCsvRowSchema>;
