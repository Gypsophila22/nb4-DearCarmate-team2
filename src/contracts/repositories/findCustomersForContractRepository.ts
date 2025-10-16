import prisma from '../../lib/prisma.js';

export const findCustomersForContractRepository = async (
  customerId: number,
) => {
  const customer = await prisma.customers.findUnique({
    where: { id: customerId },
    select: { id: true, name: true },
  });
  if (!customer) {
    throw new Error(`존재하지 않는 고객입니다`);
  }
};
