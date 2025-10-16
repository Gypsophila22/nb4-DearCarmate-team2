<<<<<<< HEAD
import prisma from '../../lib/prisma.js';
=======
import prisma from '../../config/prisma.js';
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

export const userDeleteRepository = {
  findById(id: number) {
    return prisma.users.findUnique({ where: { id } });
  },

  // 로깅용
  findByEmail(email: string) {
    return prisma.users.findUnique({ where: { email } });
  },

  async deleteById(id: number) {
    return prisma.users.delete({ where: { id } });
  },
};
