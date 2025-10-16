<<<<<<< HEAD
import prisma from '../../lib/prisma.js';
=======
import prisma from '../../config/prisma.js';
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))

export const userGetRepository = {
  findSelectedById(id: number) {
    return prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        employeeNumber: true,
        phoneNumber: true,
<<<<<<< HEAD
        imageUrl: true,
        isAdmin: true,
        company: { select: { companyCode: true } },
=======
        imgUrl: true,
        isAdmin: true,
        company: { select: { code: true } },
>>>>>>> 5994e76 (feat: user, auth 레이어드 아키텍처 적용, 이미지 등록, 이메일 전송 (#28))
      },
    });
  },
};
