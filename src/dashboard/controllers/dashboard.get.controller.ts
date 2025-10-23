import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

export const getDashboard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 인증 사용자 확인
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: '로그인이 필요합니다' });
    }

    const companyId = user.companyId;
    const now = new Date();

    // 이번 달 / 지난 달 기간 계산
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    // 매출 합계 (이번 달 / 지난 달)
    const [thisMonthSales, lastMonthSales] = await Promise.all([
      prisma.contracts.aggregate({
        _sum: { contractPrice: true },
        where: {
          status: 'contractSuccessful',
          user: { companyId }, // ✅ 수정 포인트 1
          date: { gte: thisMonthStart, lte: thisMonthEnd }, // ✅ createdAt → date로 수정
        },
      }),
      prisma.contracts.aggregate({
        _sum: { contractPrice: true },
        where: {
          status: 'contractSuccessful',
          user: { companyId },
          date: { gte: lastMonthStart, lte: lastMonthEnd },
        },
      }),
    ]);

    const monthlySales = thisMonthSales._sum.contractPrice ?? 0;
    const prevSales = lastMonthSales._sum.contractPrice ?? 0;
    const growthRate =
      prevSales === 0 ? 0 : ((monthlySales - prevSales) / prevSales) * 100;

    // 진행 중 / 완료된 계약 수
    const [proceedingContractsCount, completedContractsCount] =
      await Promise.all([
        prisma.contracts.count({
          where: {
            status: { in: ['carInspection', 'priceNegotiation'] }, // ✅ enum 실제 값
            user: { companyId },
          },
        }),
        prisma.contracts.count({
          where: {
            status: 'contractSuccessful',
            user: { companyId },
          },
        }),
      ]);

    // 차량 타입별 계약수 및 매출액
    const contracts = await prisma.contracts.findMany({
      where: { user: { companyId } }, // ✅ 수정 포인트 2
      include: {
        car: {
          include: {
            carModel: { select: { type: true } },
          },
        },
      },
    });

    // 초기값을 명시한 reduce 로직
    const statsMap = contracts.reduce(
      (acc, contract) => {
        const type = contract.car?.carModel?.type ?? 'UNKNOWN';
        if (!acc[type]) {
          acc[type] = { carType: type, count: 0, totalPrice: 0 };
        }
        acc[type].count += 1;
        acc[type].totalPrice += contract.contractPrice ?? 0;
        return acc;
      },
      {} as Record<
        string,
        { carType: string; count: number; totalPrice: number }
      >,
    );

    const contractsByCarType = Object.values(
      Object.fromEntries(
        Object.entries(statsMap).map(([type, data]) => [
          type,
          { carType: type, count: data.count },
        ]),
      ),
    );

    const salesByCarType = Object.values(
      Object.fromEntries(
        Object.entries(statsMap).map(([type, data]) => [
          type,
          { carType: type, count: data.totalPrice },
        ]),
      ),
    );

    return res.status(200).json({
      monthlySales,
      lastMonthSales: prevSales,
      growthRate: Math.round(growthRate * 100) / 100,
      proceedingContractsCount,
      completedContractsCount,
      contractsByCarType,
      salesByCarType,
    });
  } catch (err) {
    next(err);
  }
};
