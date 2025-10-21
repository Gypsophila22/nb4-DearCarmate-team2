import { CreateContractSchema } from './createContractsSchema.js';
import { DeleteContractSchema } from './deleteContractsSchema.js';
import { UpdateContractSchema } from './updateContractsSchema.js';

const contractSchema = {
  delete: DeleteContractSchema,
  create: CreateContractSchema,
  update: UpdateContractSchema,
};

Object.freeze(contractSchema);

export default contractSchema;
