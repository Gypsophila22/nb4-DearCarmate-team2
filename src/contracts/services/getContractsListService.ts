import { contractsRepository } from '../repositories/getContractsListRepository.js';

interface Contract {
  id: number;
  car: { id: number; carModel: { model: string } };
  customer: { id: number; name: string };
  user: { id: number; name: string };
  meetings: {
    date: Date;
    alarms: { time: Date }[];
  }[];
  contractPrice: number;
  resolutionDate: Date | null;
  status: string;
}
export const getContractsListService = async (
  searchBy?: string,
  keyword?: string,
) => {
  const statuses = [
    'carInspection',
    'priceNegotiation',
    'contractDraft',
    'contractSuccessful',
    'contractFailed',
  ];

  // 상태별 계약 목록과 총 아이템 수
  const result: Record<string, { totalItemCount: number; data: any[] }> = {};

  // 각 상태별 계약 조회
  for (const status of statuses) {
    const data: Contract[] = await contractsRepository.findByStatus(
      status,
      searchBy, // 검색 기준: 'customerName' | 'userName'
      keyword, // 검색 키워드
    );

    result[status] = {
      totalItemCount: data.length, // 해당 상태 계약 개수
      data: data.map((c) => ({
        id: c.id,
        car: { id: c.car.id, model: c.car.carModel.model }, // 차량 정보
        customer: { id: c.customer.id, name: c.customer.name }, // 고객 정보
        user: { id: c.user.id, name: c.user.name }, // 담당자 정보
        meetings: c.meetings.map((m) => ({
          date: m.date.toISOString().split('T')[0], // 미팅 날짜
          alarms: m.alarms.map((a) => a.time.toISOString()), // 알람 시간
        })),
        contractPrice: c.contractPrice, // 계약 금액
        resolutionDate: c.resolutionDate // 계약 완료일
          ? c.resolutionDate.toISOString()
          : null,
        status: c.status, // 계약 상태
      })),
    };
  }

  return result;
};
