import type { Dates } from '../repositories/types/dashboard.types.js';
import { dashboardRepository } from '../repositories/dashboard.get.repository.js';
import { CarType } from '@prisma/client';

function getMonthStartDates(): Dates {
  const now = new Date(); //현재 날짜
  //날짜를 yyyy-mm-dd 맞춰주는 함수
  const formatDate = (date) => {
    const year = date.getFullYear();
    //달은 0부터 시작하므로 + 1
    //2자리 숫자 맞춰줍니다.
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  };

  const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const current = new Date(now.getFullYear(), now.getMonth(), 1);
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    lastMonthStart: formatDate(last),
    currentMonthStart: formatDate(current),
    nextMonthStart: formatDate(next),
  };
}

function getGrowthRate(
  lastMonthSales: number,
  currentMonthSales: number,
): number {
  const last = lastMonthSales;
  const now = currentMonthSales;

  // 입력 검증: 숫자가 아닌 경우
  if (!isFinite(last) || !isFinite(now)) return NaN;

  // 지난달이 0인 특수 처리
  if (last === 0) {
    if (now === 0) return 0; // 0 -> 0 : 성장률 0%
    return 1; // 0 -> 양수 : 무한대 성장 (원하면 다른 값으로 변경)
  }

  // 일반 케이스: (current - last) / last * 100
  return ((now - last) / last) * 100;
}

export const dashboardGetService = {
  async getDashboard() {
    const dates = getMonthStartDates();

    const data = await dashboardRepository.getDashboardData(dates);
    const growthRate = getGrowthRate(
      Number(data.lastMonthSales),
      Number(data.monthlySales),
    );
    // console.log('성장률 산출: ' + growthRate);

    const result = {
      monthlySales: Number(data.monthlySales),
      lastMonthSales: Number(data.lastMonthSales),
      growthRate: growthRate,
      proceedingContractsCount: Number(data.proceedingContractsCount),
      completedContractsCount: Number(data.completedContractsCount),
      contractsByCarType: [
        {
          carType: CarType.SUV,
          count: Number(data.contractsBySuv),
        },
        {
          carType: CarType.세단,
          count: Number(data.contractsBySedan),
        },
        {
          carType: CarType.경차,
          count: Number(data.contractsByLight),
        },
      ],
      salesByCarType: [
        {
          carType: CarType.SUV,
          count: Number(data.salesBySuv),
        },
        {
          carType: CarType.세단,
          count: Number(data.salesBySedan),
        },
        {
          carType: CarType.경차,
          count: Number(data.salesByLight),
        },
      ],
    };

    return result;
  },
};
