import { AgeGroup } from "@prisma/client";
import type { Request, Response } from "express";
import prisma from "../../lib/prisma.js";

const ageGroupDisplayMap: { [key in AgeGroup]: string } = {
  [AgeGroup.GENERATION_10]: '10대',
  [AgeGroup.GENERATION_20]: '20대',
  [AgeGroup.GENERATION_30]: '30대',
  [AgeGroup.GENERATION_40]: '40대',
  [AgeGroup.GENERATION_50]: '50대',
  [AgeGroup.GENERATION_60]: '60대',
  [AgeGroup.GENERATION_70]: '70대',
  [AgeGroup.GENERATION_80]: '80대',
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const customerId = parseInt(req.params.id!);
    const companyId = req.user?.companyId;

    if (!companyId) {
      return res
        .status(401)
        .json({ message: '인증된 사용자 정보가 없습니다.' });
    }

    if (isNaN(customerId)) {
      return res.status(400).json({ message: '유효하지 않은 고객ID입니다.' });
    }

    const customer = await prisma.customers.findFirst({
      where: {
        id: customerId,
        companyId: companyId,
      },
    });

    if (!customer) {
      return res.status(404).json({ message: '고객을 찾을 수 없습니다.' });
    }

    const transformedCustomer = {
      ...customer,
      ageGroup: customer.ageGroup
        ? ageGroupDisplayMap[customer.ageGroup as AgeGroup]
        : null,
    };

    res.status(200).json(transformedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 내부 오류가 발생하였습니다.' });
  }
};
