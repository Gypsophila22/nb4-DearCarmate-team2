import prisma from '../lib/prisma.js';
import { CarType, Prisma } from '@prisma/client';
import type { Cars } from '@prisma/client';
type CarsCreateManyInput = Prisma.CarsCreateManyInput;
type UniqueModel = { manufacturer: string; model: string };
import type { CarFilter } from './services/getCarsListService.js';

class CarRepository {
  // 차량 모델 생성
  createCarsModelRepository = {
    createModel: (data: {
      manufacturer: string;
      model: string;
      type: CarType;
    }) =>
      prisma.carModel.create({
        data,
      }),
  };

  // 차량 생성
  createCarsRepository = {
    create: (data: Prisma.CarsCreateInput) =>
      prisma.cars.create({
        data,
        include: { carModel: true },
      }),
  };
  // 차량 모델 생성 (트랜잭션)
  createCarsModelTxRepository = {
    create: (
      tx: Prisma.TransactionClient,
      data: { manufacturer: string; model: string; type: CarType },
    ) => tx.carModel.create({ data }),
    createMany: (
      tx: Prisma.TransactionClient,
      data: { manufacturer: string; model: string; type: CarType }[],
    ) => tx.carModel.createMany({ data, skipDuplicates: true }),
  };

  // 트랜잭션 내 차량 생성
  createManyTx = (tx: Prisma.TransactionClient, data: CarsCreateManyInput[]) =>
    tx.cars.createMany({ data });

  /**
   * 여러 차량 모델 조회
   * @param uniqueModels - [{ manufacturer, model }]
   */
  carFindManyModelRepository = (uniqueModels: UniqueModel[]) => {
    return prisma.carModel.findMany({
      where: {
        OR: uniqueModels.map((r) => ({
          manufacturer: r.manufacturer,
          model: r.model,
        })),
      },
    });
  };

  /**
   * 주어진 차량 번호 배열로 DB에서 이미 존재하는 차량 조회
   * @param carNumbers
   * @returns 존재하는 차량 배열
   */
  findManyByCarNumbers = async (carNumbers: string[]): Promise<Cars[]> => {
    if (carNumbers.length === 0) return [];
    return prisma.cars.findMany({
      where: {
        carNumber: {
          in: carNumbers,
        },
      },
    });
  };

  // 제조사와 모델명으로 carModel 조회
  findCarModelRepository = {
    findByManufacturerAndModel: (manufacturer: string, model: string) =>
      prisma.carModel.findFirst({
        where: { manufacturer, model },
      }),
  };

  // 차량 목록 조회
  getCarsListRepository = {
    async findCars(filter: CarFilter) {
      const [cars, totalItemCount] = await Promise.all([
        prisma.cars.findMany({
          where: filter.search, // 검색
          skip: filter.page, // 패스할 아이템
          take: filter.pageSize, // 가져올 아이템
          include: { carModel: true }, // 차종 관계 포함
        }),
        prisma.cars.count({
          where: filter.search, // 전체 아이템 수 (totalItemCount)
        }),
      ]);

      return { cars, totalItemCount };
    },
  };
}

export const carRepository = new CarRepository();
