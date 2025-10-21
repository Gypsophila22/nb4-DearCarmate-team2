import prisma from '../../lib/prisma.js';

export const findCustomersForContractRepository = async (
  customerId: number,
) => {
  const customer = await prisma.customers.findUnique({
    where: { id: customerId },
    select: { id: true, name: true },
  });
  return customer;
};
