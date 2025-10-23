import { CarType, Prisma } from '@prisma/client';

import prisma from '../lib/prisma.js';

import type { Cars, CarStatus } from '@prisma/client';
type CarsCreateManyInput = Prisma.CarsCreateManyInput;
type UniqueModel = { manufacturer: string; model: string };
import type { CarFilter } from './services/car.get-list.service.js';

interface UpdateCarData {
  carNumber?: string;
  manufacturingYear?: number;
  mileage?: number;
  price?: number;
  accidentCount?: number;
  explanation?: string;
  accidentDetails?: string;
  status?: CarStatus;
}

class CarRepository {
  findModelWithManufacturer = async () => {
    return prisma.carModel.findMany();
  };

  findCarById = async (carId: number) => {
    return prisma.cars.findUnique({
      where: { id: carId },
    });
  };

  // 차량 조회 (carModel 관계 포함)
  getCarByIdWithModel = async (carId: number) => {
    return prisma.cars.findUnique({
      where: { id: carId },
      include: {
        carModel: true,
      },
    });
  };

  // 차량 모델 생성
  createModel = async (data: {
    manufacturer: string;
    model: string;
    type: CarType;
  }) => {
    return prisma.carModel.create({ data });
  };

  // 차량 생성
  create = async (data: Prisma.CarsCreateInput) => {
    return prisma.cars.create({
      data,
      include: { carModel: true },
    });
  };

  // 차량 모델 생성 (트랜잭션)
  createModelTx = async (
    tx: Prisma.TransactionClient,
    data: { manufacturer: string; model: string; type: CarType },
  ) => {
    return tx.carModel.create({ data });
  };

  // 차량 모델 한번에 생성 (트랜잭션)
  createManyModelTx = async (
    tx: Prisma.TransactionClient,
    data: { manufacturer: string; model: string; type: CarType }[],
  ) => {
    return tx.carModel.createMany({ data, skipDuplicates: true });
  };

  // 차량 한번에 생성 (트랜잭션)
  createManyTx = async (
    tx: Prisma.TransactionClient,
    data: CarsCreateManyInput[],
  ) => {
    return tx.cars.createMany({ data });
  };

  /**
   * 여러 차량 모델 조회
   * @param uniqueModels - [{ manufacturer, model }]
   */
  findManyModel = async (uniqueModels: UniqueModel[]) => {
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
  findByManufacturerAndModel = async ({
    manufacturer,
    model,
  }: {
    manufacturer: string;
    model: string;
  }) => {
    return prisma.carModel.findUnique({
      where: { manufacturer_model: { manufacturer, model } },
    });
  };

  // 차량 목록 조회
  findList = async (filter: CarFilter) => {
    const [cars, totalItemCount] = await Promise.all([
      prisma.cars.findMany({
        where: filter.search, // 검색
        skip: filter.page, // 패스할 아이템
        take: filter.pageSize, // 가져올 아이템
        include: { carModel: true }, // 차종 관계 포함
        orderBy: { id: 'desc' }, // 최신순
      }),
      prisma.cars.count({
        where: filter.search, // 전체 아이템 수 (totalItemCount)
      }),
    ]);

    return { cars, totalItemCount };
  };

  // 차량 수정
  update = async ({
    carId,
    updateData,
  }: {
    carId: number;
    updateData: UpdateCarData;
  }) => {
    return prisma.cars.update({
      where: { id: carId },
      data: updateData,
      include: { carModel: true },
    });
  };

  updateCarModelId = async (carId: number, modelId: number) => {
    return prisma.cars.update({
      where: { id: carId },
      data: { modelId },
      include: { carModel: true },
    });
  };

  delete = async (carId: number) => {
    return prisma.cars.delete({
      where: { id: carId },
    });
  };
}

export const carRepository = new CarRepository();
