import { CreateContractSchema } from './createContractsSchema.js';
import { DeleteContractSchema } from './deleteContractsSchema.js';

const contractSchema = {
  delete: DeleteContractSchema,
  create: CreateContractSchema,
};

Object.freeze(contractSchema);

export default contractSchema;
