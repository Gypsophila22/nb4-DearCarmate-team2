import prisma from "../../lib/prisma.js";

import type { ContractsStatus } from "@prisma/client";

export const getContractsListRepository = {
  findByStatus: async (
    status: ContractsStatus,
    searchBy?: "customerName" | "userName",
    keyword?: string,
  ) => {
    // 계약 조회
    return prisma.contracts.findMany({
      where: {
        status,
        ...(searchBy && keyword
          ? searchBy === "customerName"
            ? { customer: { name: { contains: keyword, mode: "insensitive" } } }
            : { user: { name: { contains: keyword, mode: "insensitive" } } }
          : {}),
      },
      include: {
        car: { select: { id: true, carModel: { select: { model: true } } } }, // 차량
        customer: { select: { id: true, name: true } }, // 고객
        user: { select: { id: true, name: true } }, // 담당자
        meetings: { include: { alarms: true } }, // 미팅 및 알람 정보
      },
      orderBy: { date: "desc" }, // 최신순 정렬
    });
  },
};
