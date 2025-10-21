import contractRepository from '../repositories/index.js';

export const deleteContractsService = async (contractId: number) => {
  // 계약 존재 여부 확인 레포지토리 호출
  await contractRepository.findContract(contractId);
  // 계약 삭제 레포지토리 호출
  await contractRepository.delete(contractId);
};
