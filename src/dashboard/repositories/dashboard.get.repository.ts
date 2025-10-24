import prisma from '../../lib/prisma.js';
import type { Dates } from './types/dashboard.types.js';

import type { DashboardData } from './types/dashboard.types.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SQL_NAME = 'get-dashboard.sql';
const SQL_PATH = path.join(__dirname, 'queries', SQL_NAME);
const SQL = fs.readFileSync(SQL_PATH, 'utf-8');

class DashboardRepository {
  async getDashboardData(dates: Dates) {
    const results = await prisma.$queryRawUnsafe<DashboardData>(
      SQL,
      dates.lastMonthStart,
      dates.currentMonthStart,
      dates.nextMonthStart,
    );

    return results[0];
  }
}

export const dashboardRepository = new DashboardRepository();
