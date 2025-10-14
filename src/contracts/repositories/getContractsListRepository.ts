import prisma from '../../lib/prisma.js';

export const contractsRepository = {
  findByStatus: async (status: string, searchBy?: string, keyword?: string) => {
    // 계약 상태 필터
    const where: any = { status };

    // 검색 조건
    if (searchBy && keyword) {
      if (searchBy === 'customerName') {
        // 고객 이름
        where.customer = { name: { contains: keyword, mode: 'insensitive' } };
      } else if (searchBy === 'userName') {
        // 담당자 이름
        where.user = { name: { contains: keyword, mode: 'insensitive' } };
      }
    }

    // 계약 조회
    return prisma.contracts.findMany({
      where,
      include: {
        car: { select: { id: true, carModel: { select: { model: true } } } }, // 차량
        customer: { select: { id: true, name: true } }, // 고객
        user: { select: { id: true, name: true } }, // 담당자
        meetings: { include: { alarms: true } }, // 미팅 및 알람 정보
      },
      orderBy: { date: 'desc' }, // 최신순 정렬
    });
  },
};
