import createError from 'http-errors';
import { contractRepository } from '../repositories/contract.repository.js';
import prisma from '../../lib/prisma.js';
export const contractDeleteService = async ({
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
  if (!(contract.userId === userId || contract.userId === null)) {
    throw createError(403, '담당자만 수정이 가능합니다');
  }

  await prisma.$transaction(async (tx) => {
    // 차량이 "계약 진행 중"일 때만 "보유 중"으로 되돌림
    await contractRepository.revertCarToPossessionIfProceedingTx(
      tx,
      contract.carId,
    );
    // FK(onDelete: Cascade) 설정되어 있으면 하위(미팅/알람/문서) 정리도 함께 처리됨
    await contractRepository.deleteTx(tx, contract.id);
  });
};
