import { Prisma } from '@prisma/client';

type CarsCreateManyInput = Prisma.CarsCreateManyInput;

// 트랜잭션 내 차량 생성
export const createManyTx = (
  tx: Prisma.TransactionClient,
  data: CarsCreateManyInput[],
) => tx.cars.createMany({ data });
