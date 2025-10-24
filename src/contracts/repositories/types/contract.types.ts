import type { ContractsStatus } from '@prisma/client';

export interface Contract {
  id: number;
  car: {
    id: number;
    carModel: {
      model: string;
    };
  };
  customer: { id: number; name: string };
  user: { id: number; name: string };
  meetings: {
    date: Date;
    alarms: { time: Date }[];
  }[];
  contractPrice: number;
  resolutionDate: Date | null;
  status: ContractsStatus;
}

export interface ContractForList {
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
  status: ContractsStatus;
}

export interface GetListQuery {
  searchBy?: 'customerName' | 'userName';
  keyword?: string;
}

export interface CreateContractInput {
  carId: number;
  customerId: number; // 고객
  meetings: { date: string; alarms: string[] }[]; // 미팅 일정
  userId: number; // 계약 담당자
}

export interface UpdateContractInput {
  contractId: number;
  status?: ContractsStatus; // 계약 상태
  resolutionDate?: string; // 계약 종료일
  contractPrice?: number; // 계약 가격
  meetings?: { id?: number; date: string; alarms: string[] }[]; // 일정
  contractDocuments?: { id?: number; fileName?: string }[]; // 계약서
  userId?: number; // 담당자
  customerId?: number; // 고객
  carId?: number; // 차량
}

export interface CreateContractForRepository {
  carId: number; // 차량
  customerId: number; // 고객
  contractPrice: number; // 계약 가격
  userId: number; // 계약 담당자
}

export interface FindQuery {
  status: ContractsStatus;
  searchBy?: 'customerName' | 'userName';
  keyword?: string;
}
