import createError from 'http-errors';
import { contractRepository } from '../repositories/contract.repository.js';

export const deleteContractsService = async ({
  contractId,
  userId,
}: {
  contractId: number;
  userId: number;
}) => {
  // 계약 존재 여부 확인 레포지토리 호출
  const contract = await contractRepository.contractFindById(contractId);
  if (!contract) {
    throw createError(404, '존재하지 않는 계약입니다');
  }
  if (contract.userId !== userId) {
    throw createError(403, '담당자만 수정이 가능합니다');
  }

  // TODO: 차량 상태에 따라 차량 상태 변경 (계약 완료 상태면 그대로, 계약 진행중이면 다시 보유중으로)

  // 계약 삭제 레포지토리 호출
  await contractRepository.delete(contractId);
};
