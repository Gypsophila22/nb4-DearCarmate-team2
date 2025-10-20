import { getCustomersSchema } from './customers.schema.js';

export const customerValidation = {
  getCustomersSchema,
} as const satisfies Record<string, import('zod').ZodTypeAny>;

export default Object.freeze(customerValidation);
