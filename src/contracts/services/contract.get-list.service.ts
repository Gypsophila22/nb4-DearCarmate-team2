import { ContractsStatus } from '@prisma/client';
import { contractRepository } from '../repositories/contract.repository.js';
import type {
  ContractForList,
  GetListQuery,
} from '../repositories/types/contract.types.js';

// 정렬 헬퍼
const sortFutureFirstBy = <T>(arr: T[], getDate: (x: T) => Date) => {
  const now = Date.now();
  return arr.slice().sort((a, b) => {
    const an = +getDate(a),
      bn = +getDate(b);
    const aPast = an < now,
      bPast = bn < now;
    if (aPast !== bPast) return aPast ? 1 : -1; // 미래 먼저, 과거 뒤로
    return an - bn; // 가까운 순
  });
};
const sortAscBy = <T>(arr: T[], getDate: (x: T) => Date) =>
  arr.slice().sort((a, b) => +getDate(a) - +getDate(b));

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
    const rows = await contractRepository.findByStatus({
      status,
      searchBy, // 검색 기준: 'customerName' | 'userName'
      keyword, // 검색 키워드
    });

    result[status] = {
      totalItemCount: rows.length, // 해당 상태 계약 개수
      data: rows.map((c) => ({
        id: c.id,
        car: { id: c.car.id, model: c.car.carModel.model }, // 차량 정보
        customer: { id: c.customer.id, name: c.customer.name }, // 고객 정보
        user: c.user
          ? { id: c.user.id, name: c.user.name }
          : { id: 0, name: '담당자 없음' },
        meetings: sortFutureFirstBy(c.meetings, (m) => m.date).map((m) => ({
          date: m.date,
          alarms: sortAscBy(m.alarms, (a) => a.time).map((a) => ({
            time: a.time,
          })),
        })),
        contractPrice: c.contractPrice, // 계약 금액
        resolutionDate: c.resolutionDate ?? null, // 계약 종료일
        status: c.status, // 계약 상태
      })),
    };
  }

  return result;
};
