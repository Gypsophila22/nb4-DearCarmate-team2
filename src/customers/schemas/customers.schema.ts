import { z } from 'zod';
import { Gender, Region, AgeGroup } from '@prisma/client';

export const getCustomersSchema = z.object({
  query: z.object({
    page: z.string().optional().transform(val => val ? parseInt(val, 10) : 1),
    pageSize: z.string().optional().transform(val => val ? parseInt(val, 10) : 10),
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
    email: z.string().email({ message: '유효하지 않은 이메일 형식입니다.' }).optional(),
    memo: z.string().optional(),
  }),
});

export const updateCustomerSchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val, 10)),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
    gender: z.nativeEnum(Gender).optional(),
    phoneNumber: z.string().min(1).optional(),
    ageGroup: z.nativeEnum(AgeGroup).optional(),
    region: z.nativeEnum(Region).optional(),
    email: z.string().email().optional(),
    memo: z.string().optional(),
  }),
});

export const deleteCustomerSchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val, 10)),
  }),
});

export const getCustomerByIdSchema = z.object({
  params: z.object({
    id: z.string().transform(val => parseInt(val, 10)),
  }),
});


export type GetCustomersQuery = z.infer<typeof getCustomersSchema>['query'];
export type CreateCustomerBody = z.infer<typeof createCustomerSchema>['body'];
export type UpdateCustomerParams = z.infer<typeof updateCustomerSchema>['params'];
export type UpdateCustomerBody = z.infer<typeof updateCustomerSchema>['body'];
export type DeleteCustomerParams = z.infer<typeof deleteCustomerSchema>['params'];
export type GetCustomerByIdParams = z.infer<typeof getCustomerByIdSchema>['params'];
