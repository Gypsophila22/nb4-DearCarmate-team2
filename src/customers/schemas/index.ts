import { getCustomersSchema, createCustomerSchema, updateCustomerSchema, deleteCustomerSchema, getCustomerByIdSchema } from './customers.schema.js';

export const customerValidation = {
  getCustomersSchema,
  createCustomerSchema,
  updateCustomerSchema,
  deleteCustomerSchema,
  getCustomerByIdSchema,
} as const satisfies Record<string, import('zod').ZodTypeAny>;

export default Object.freeze(customerValidation);