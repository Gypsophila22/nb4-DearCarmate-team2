import type { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/prisma.js';

export async function getDocumentDrafts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.user)
      return res.status(401).json({ message: '로그인이 필요합니다' });

    // 회사 경계 내 계약만 (담당자 user.companyId 기준)
    const contracts = await prisma.contracts.findMany({
      where: { user: { companyId: req.user.companyId } },
      orderBy: { date: 'desc' },
      select: {
        id: true,
        car: {
          select: { carNumber: true, carModel: { select: { model: true } } },
        },
        customer: { select: { name: true } },
      },
    });

    const items = contracts.map((c) => {
      const modelName = c.car?.carModel?.model ?? c.car?.carNumber ?? '차량';
      const customerName = c.customer?.name ?? '고객';
      return { id: c.id, data: `${modelName} - ${customerName} 고객님` };
    });

    return res.status(200).json(items);
  } catch (err) {
    next(err);
  }
}
