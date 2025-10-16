<<<<<<< HEAD
import prisma from '../../lib/prisma.js';
=======
import prisma from '../../config/prisma.js';
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

export const userRepository = {
  async findByEmail(email: string) {
    return prisma.users.findUnique({
      where: { email },
<<<<<<< HEAD
      select: {
        id: true,
        name: true,
        email: true,
        employeeNumber: true,
        phoneNumber: true,
        imageUrl: true,
        isAdmin: true,
        password: true,
        company: {
          select: { companyCode: true },
        },
      },
=======
      include: { company: { select: { code: true } } },
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
    });
  },
};
