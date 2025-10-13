import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
import prisma from '../../lib/prisma.js';
export const getCustomers = async (req: Request, res: Response) => {
    try {
        // 로그인한 유저의 회사 ID를 가져옵니다
        const companyId = req.user?.companyId;
        if (!companyId) {
            return res.status(401).json({ message: '인증된 사용자 정보가 없습니다.' });
        }

        // 페이지네이션 추가
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;
        const { name, email } = req.query;
        
        const where: Prisma.CustomersWhereInput = {
            companyId: companyId,
        };

        if (name) {
            where.name = {
                contains: name as string,
            };
        }
        
        if (email) {
            where.email = {
                contains: email as string,
            };
        }

        const customers = await prisma.customers.findMany({
            where,
            take: limit,
            skip: skip,
        });
        // 전체 데이터를 조회하여 총 페이지 수 계산
        const totalCustomers = await prisma.customers.count({
            where,
        });

        const totalPages = Math.ceil(totalCustomers / limit);
        // 페이지네이션 정보를 포함하여 응답
        res.status(200).json({
            customers,
            pagination: {
                totalItems: totalCustomers,
                totalPages,
                currentPage: page,
                pageSize: limit,
            },
        });

    }   catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 내부 오류가 발생하였습니다.' });
    }
};
  