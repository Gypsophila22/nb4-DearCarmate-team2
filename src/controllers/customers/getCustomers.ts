import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

export interface AuthRequest extends Request {
    user?: {
        id: number;
        companyId: number;
    };
}

export const getCustomers = async (req: AuthRequest, res: Response) => {
    try {
        // 로그인한 유저의 회사 ID를 가져옵니다
        const companyId = req.user?.companyId;
        if (!companyId) {
            return res.status(401).json({ message: '인증된 사용자 정보가 없습니다.' });
        }
        // 해당 회사의 고객 목록을 데이터베이스에서 조회합니다.
        const customers = await prisma.customers.findMany({
            where: {
                companyId: companyId,
            },
        });
        // 조회된 고객 목록을 응답
        res.status(200).json(customers);
    }   catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 내부 오류가 발생하였습니다.' });
    }
};