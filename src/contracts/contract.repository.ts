import { CarStatus, ContractsStatus, Prisma } from '@prisma/client';
import prisma from '../lib/prisma.js';

import createError from 'http-errors';

class ContractRepository {
  /**
   * 차량으로 이미 존재하는 계약 조회
   */
  contractFindExisting = async (carId: number) => {
    const existingContract = await prisma.contracts.findUnique({
      where: { carId },
    });

    return existingContract;
  };
  // 차량 정보 조회
  findCarById = async (carId: number) => {
    const car = await prisma.cars.findUnique({
      where: { id: carId },
      select: {
        id: true,
        price: true, // 차량 가격
        status: true, // 차량 상태
        carModel: { select: { model: true } }, // 차량 이름
      },
    });
    if (!car) throw createError(404, '차량을 찾을 수 없습니다');
    return {
      id: car.id,
      price: car.price,
      status: car.status,
      model: car.carModel.model,
    };
  };
  // 고객 정보 조회
  findCustomerById = async (customerId: number) => {
    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
      select: { id: true, name: true },
    });
    if (!customer) throw createError(404, '고객을 찾을 수 없습니다');
    return customer;
  };

  // 미팅 및 알람 생성
  createMeetingsAndAlarms = async (
    contractId: number,
    meetings: { date: string; alarms: string[] }[],
  ) => {
    // 미팅 생성 병렬 처리
    const createMeetings = await Promise.all(
      meetings.map((m) =>
        prisma.meetings.create({
          data: { date: new Date(m.date), contractId },
        }),
      ),
    );

    // 알람 생성 병렬 처리
    const alarmPromises = createMeetings.flatMap((meeting, i) => {
      const alarms = meetings[i]?.alarms;
      if (!alarms || alarms.length === 0) return []; // alarms 없으면 건너뜀
      return alarms.map((a) =>
        prisma.alarms.create({
          data: { time: new Date(a), meetingId: meeting.id },
        }),
      );
    });
    await Promise.all(alarmPromises);

    return createMeetings.map((meeting, i) => ({
      ...meeting,
      alarms: meetings[i]?.alarms.map((time) => ({ time: new Date(time) })),
    }));
  };

  // 차량 상태 업데이트 (보유 중 -> 계약 진행 중)
  updateCarStatus = async (carId: number) => {
    const status = CarStatus.contractProceeding; // 계약 진행 중
    return prisma.cars.update({ where: { id: carId }, data: { status } });
  };

  // 계약 생성
  create = async (data: {
    carId: number; // 차량
    customerId: number; // 고객
    contractPrice: number; // 계약 가격
    userId: number; // 계약 담당자
  }) => {
    return prisma.contracts.create({
      data: {
        carId: data.carId, // 차량
        customerId: data.customerId, // 고객
        userId: data.userId, // 로그인 사용자 (계약 담당자))
        status: ContractsStatus.carInspection, // 계약 상태: 차량 확인
        resolutionDate: null, // 계약 완료 시간
        contractPrice: data.contractPrice, // 차량 가격 기본값
      },
    });
  };
  delete = async (contractId: number) => {
    // 계약 삭제
    await prisma.contracts.delete({
      where: { id: contractId },
    });
  };
  findCar = async (carId: number) => {
    const car = await prisma.cars.findUnique({
      where: { id: carId },
      include: {
        carModel: true, // carModel 관계 포함
      },
    });

    return car;
  };

  findContractsRepository = async (contractId: number) => {
    const contract = await prisma.contracts.findUnique({
      where: { id: contractId },
      include: {
        user: true,
      },
    });
    return contract;
  };

  findCustomer = async (customerId: number) => {
    const customer = await prisma.customers.findUnique({
      where: { id: customerId },
      select: { id: true, name: true },
    });
    return customer;
  };

  findUser = async (userId: number) => {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });
    return user;
  };

  // 연결 계약이 없는 차량만 조회
  getCarsList = async () => {
    const cars = await prisma.cars.findMany({
      where: {
        contract: null,
      },
      include: {
        carModel: true,
      },
      orderBy: {
        id: 'asc',
      },
    });

    return cars;
  };

  findByStatus = async (
    status: ContractsStatus,
    searchBy?: 'customerName' | 'userName',
    keyword?: string,
  ) => {
    // 계약 조회
    return prisma.contracts.findMany({
      where: {
        status,
        ...(searchBy && keyword
          ? searchBy === 'customerName'
            ? {
                customer: {
                  name: { contains: keyword, mode: 'insensitive' },
                },
              }
            : { user: { name: { contains: keyword, mode: 'insensitive' } } }
          : {}),
      },
      include: {
        car: { select: { id: true, carModel: { select: { model: true } } } }, // 차량
        customer: { select: { id: true, name: true } }, // 고객
        user: { select: { id: true, name: true } }, // 담당자
        meetings: { include: { alarms: true } }, // 미팅 및 알람 정보
      },
      orderBy: { date: 'desc' }, // 최신순 정렬
    });
  };

  getCustomers = async () => {
    const customers = await prisma.customers.findMany({
      orderBy: { id: 'asc' },
    });

    return customers;
  };

  /**
   * 계약용 유저 리스트 조회 레포지토리
   * @returns
   */
  getUsers = async () => {
    const users = await prisma.users.findMany({
      orderBy: { id: 'asc' },
    });
    return users;
  };

  findById = async (contractId: number) => {
    return prisma.contracts.findUnique({
      where: { id: contractId },
      include: { meetings: true, documents: true },
    });
  };

  // 업데이트 response 계약 조회
  findByIdForResponse = async (contractId: number) => {
    return prisma.contracts.findUnique({
      where: { id: contractId },
      include: {
        user: true,
        customer: true,
        car: { include: { carModel: true } },
        meetings: { include: { alarms: true } },
      },
    });
  };

  // 계약 수정
  update = async (contractId: number, data: Prisma.ContractsUpdateInput) => {
    const { car, ...rest } = data;

    const updateData: Prisma.ContractsUpdateInput = {
      ...rest,
      ...(car ? { car } : {}), // car가 있을 때만 포함
    };

    return prisma.contracts.update({
      where: { id: contractId },
      data: updateData,
      include: {
        user: true,
        customer: true,
        car: {
          include: { carModel: true },
        },
        meetings: {
          include: {
            alarms: true,
          },
        },
      },
    });
  };

  // 미팅 업데이트
  updateMeetings = async (
    contractId: number,
    meetings: { id?: number; date: string; alarms: string[] }[],
  ) => {
    // 기존 계약에 연결된 미팅 삭제 (알람 포함))
    await prisma.meetings.deleteMany({ where: { contractId } });

    // 미팅 생성 + 알람 생성 병렬 처리
    const meetingPromises = meetings.map(async (m) => {
      const meetingDate = new Date(m.date);
      if (isNaN(meetingDate.getTime())) {
        throw createError(
          400,
          `유효하지 않은 미팅입니다. 입력된 값: ${m.date}`,
        );
      }

      const meeting = await prisma.meetings.create({
        data: { date: meetingDate, contractId },
      });

      const alarmPromises = (m.alarms || []).map((alarmTime) => {
        const alarmDate = new Date(alarmTime);
        if (isNaN(alarmDate.getTime())) {
          throw createError(
            400,
            `유효하지 않은 알람입니다. 입력된 값: ${m.date}`,
          );
        }

        return prisma.alarms.create({
          data: { time: alarmDate, meetingId: meeting.id },
        });
      });

      await Promise.all(alarmPromises);

      return {
        ...meeting,
        alarms: (m.alarms || []).map((time) => ({ time: new Date(time) })),
      };
    });

    return Promise.all(meetingPromises);
  };

  // 계약 문서 업데이트
  updateContractDocuments = async (
    contractId: number, // 연결할 계약 id
    documents: { id: number; originalName: string }[], // 변경할 계약서 (이미 DB에 들어있음)
  ) => {
    // 기존 계약서 중 새로 요청 받은 데이터 목록에 없는 데이터 삭제
    const newDocIds = documents.map((d) => d.id);

    await prisma.contractDocuments.deleteMany({
      where: {
        contractId,
        id: { notIn: newDocIds },
      },
    });

    // 새로 추가된 계약서를 계약에 연결
    for (const doc of documents) {
      await prisma.contractDocuments.update({
        where: { id: doc.id },
        data: { contractId },
      });
    }
  };
}
export const contractRepository = new ContractRepository();
