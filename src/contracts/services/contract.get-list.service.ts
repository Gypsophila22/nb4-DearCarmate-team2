import { ContractsStatus } from '@prisma/client';
import { contractRepository } from '../repositories/contract.repository.js';
import type {
  ContractForList,
  GetListQuery,
} from '../repositories/types/contract.types.js';

export const contractGetListService = async ({
  searchBy,
  keyword,
}: GetListQuery) => {
  const result: Record<
    string,
    {
      totalItemCount: number;
      data: ContractForList[];
    }
  > = {};

  // 각 상태별 계약 조회
  for (const status of Object.values(ContractsStatus)) {
    const data: ContractForList[] = await contractRepository.findByStatus({
      status,
      searchBy, // 검색 기준: 'customerName' | 'userName'
      keyword, // 검색 키워드
    });

    result[status] = {
      totalItemCount: data.length, // 해당 상태 계약 개수
      data: data.map((c) => ({
        id: c.id,
        car: { id: c.car.id, carModel: { model: c.car.carModel.model } }, // 차량 정보
        customer: { id: c.customer.id, name: c.customer.name }, // 고객 정보
        user: { id: c.user.id, name: c.user.name }, // 담당자 정보
        meetings: c.meetings.map((m) => ({
          date: m.date, // Date 타입 그대로
          alarms: m.alarms.map((a) => ({ time: a.time })), // 객체 형태로
        })),
        contractPrice: c.contractPrice, // 계약 금액
        resolutionDate: c.resolutionDate ?? null, // 계약 종료일
        status: c.status, // 계약 상태
      })),
    };
  }

  return result;
};
