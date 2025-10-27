import { Prisma } from '@prisma/client';
import prisma from '../../lib/prisma.js';
import type { Dates } from './types/dashboard.types.js';

import type { DashboardData } from './types/dashboard.types.js';

class DashboardRepository {
  async getDashboardData(dates: Dates) {
    //#region SQL
    const results = await prisma.$queryRaw<DashboardData>(
      Prisma.sql`
      SELECT
    --$1 = 저번 달 시작 날짜
    --$2 = 이번 달 시작 날짜
    --$3 = 다음 달 시작 날짜
    SUM(
        --저번 달 합산
        CASE
            WHEN con."status" = 'contractSuccessful'::"ContractsStatus"
						AND con."resolutionDate" >= ${dates.lastMonthStart}::timestamptz
            AND con."resolutionDate" < ${dates.currentMonthStart}::timestamptz
            THEN con."contractPrice"
            ELSE 0
        END
    ) AS "lastMonthSales",
	SUM(
        CASE
            WHEN con."status" = 'contractSuccessful'::"ContractsStatus"
						AND con."resolutionDate" >= ${dates.currentMonthStart}::timestamptz
            AND con."resolutionDate" < ${dates.nextMonthStart}::timestamptz
            THEN con."contractPrice"
            ELSE 0
        END
    ) AS "monthlySales",

    --$4 = 계약 보류 중 상태 배열
    --$5 = 계약 성공 상태 배열
	COUNT(
		CASE
			WHEN con."status" IN('carInspection', 'priceNegotiation', 'contractDraft')
			THEN 1
			ELSE NULL
		END
	) AS "proceedingContractsCount",
	COUNT(
		CASE
			WHEN con."status" IN('contractSuccessful')
			THEN 1
			ELSE NULL
		END
	) AS "completedContractsCount",

	--$6, $7, $8는 각 차종 배열값
	COUNT( 
		CASE 
			WHEN con."status" IN('carInspection', 'priceNegotiation', 'contractDraft')
			AND m.type = 'SUV'
			THEN 1
			ELSE NULL
		END
	) AS "contractsBySuv",
	COUNT( 
		CASE 
			WHEN con."status" IN('carInspection', 'priceNegotiation', 'contractDraft')
			AND m.type = '세단'
			THEN 1
			ELSE NULL
		END
	) AS "contractsBySedan",
	COUNT( 
		CASE 
			WHEN con."status" IN('carInspection', 'priceNegotiation', 'contractDraft')
			AND m.type = '경차'
			THEN 1
			ELSE NULL
		END
	) AS "contractsByLight",
		COUNT( 
		CASE 
			WHEN con."status" IN('contractSuccessful')
			AND m.type = 'SUV'
			THEN 1
			ELSE NULL
		END
	) AS "salesBySuv",
	COUNT( 
		CASE 
			WHEN con."status" IN('contractSuccessful')
			AND m.type = '세단'
			THEN 1
			ELSE NULL
		END
	) AS "salesBySedan",
	COUNT( 
		CASE 
			WHEN con."status" IN('contractSuccessful')
			AND m.type = '경차'
			THEN 1
			ELSE NULL
		END
	) AS "salesByLight"

FROM
	"Contracts" AS con
JOIN "Cars" AS car 
ON con."carId" = car.id
JOIN "CarModel" AS m
ON car."modelId" = m.id`,
    );
    //#endregion
    return results[0];
  }
}

export const dashboardRepository = new DashboardRepository();
