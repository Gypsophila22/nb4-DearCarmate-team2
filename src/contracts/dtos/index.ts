import { CreateContractDto } from './createContractsDto.js';
import { DeleteContractDto } from './deleteContractsDto.js';

const contractDto = {
  delete: DeleteContractDto,
  create: CreateContractDto,
};

Object.freeze(contractDto);

export default contractDto;
