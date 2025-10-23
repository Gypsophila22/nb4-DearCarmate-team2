import { ContractsStatus } from '@prisma/client';

export const PROCEEDING_CONTRACT_STATUSES = [
  ContractsStatus.carInspection,
  ContractsStatus.priceNegotiation,
  ContractsStatus.contractDraft,
];

export const SUCCESS_CONTRACT_STATUES = [ContractsStatus.contractSuccessful];

export const FAILED_CONTRACT_STATUES = [ContractsStatus.contractFailed];
