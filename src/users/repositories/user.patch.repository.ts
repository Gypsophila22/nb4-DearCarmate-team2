import prisma from '../../config/prisma.js'; // 싱글톤 Prisma 사용

export const userPatchRepository = {
  findById(id: number) {
    return prisma.users.findUnique({ where: { id } });
  },

  updateById(
    id: number,
    data: Partial<{
      employeeNumber: string;
      phoneNumber: string;
      imageUrl: string | null;
      password: string;
    }>
  ) {
    return prisma.users.update({
      where: { id },
      data,
    });
  },
};
