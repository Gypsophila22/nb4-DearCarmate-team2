import prisma from '../../lib/prisma.js';

export const getCustomersListForContractRepository = async () => {
  const customers = await prisma.customers.findMany({
    orderBy: { id: 'asc' },
  });

  return customers;
};
