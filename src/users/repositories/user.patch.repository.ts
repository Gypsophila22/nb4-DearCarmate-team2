<<<<<<< HEAD
import prisma from '../../lib/prisma.js';
=======
import prisma from '../../config/prisma.js'; // 싱글톤 Prisma 사용

>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
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
