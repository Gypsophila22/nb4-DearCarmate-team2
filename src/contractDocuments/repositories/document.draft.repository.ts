import prisma from '../../lib/prisma.js';

export const documentDraftsRepository = {
  findDraftableContracts(companyId: number) {
    return prisma.contracts.findMany({
      where: { user: { companyId } },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        car: {
          select: {
            carNumber: true,
            carModel: { select: { model: true } },
          },
        },
        customer: { select: { name: true } },
      },
    });
  },
};
