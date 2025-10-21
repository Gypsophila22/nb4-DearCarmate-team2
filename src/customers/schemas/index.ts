import {
  getCustomersSchema,
  createCustomerSchema,
  updateCustomerSchema,
  deleteCustomerSchema,
  getCustomerByIdSchema,
  customerCsvRowSchema,
} from './customers.schema.js';

const customerValidation = {
  getCustomersSchema,
  createCustomerSchema,
  updateCustomerSchema,
  deleteCustomerSchema,
  getCustomerByIdSchema,
  customerCsvRowSchema,
} as const satisfies Record<string, import('zod').ZodTypeAny>;

export { customerValidation };
