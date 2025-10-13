import { Gender, Region } from '@prisma/client';
import type { Request, Response } from 'express';
import { z, ZodError } from 'zod';
import prisma from '../../lib/prisma.js';

// zod 를 이용해 유효성 검사
const updateCustomerSchema = z.object({
    name: z.string().min(1).optional(),
    gender: z.nativeEnum(Gender).optional(),
    phoneNumber: z.string().min(1).optional(),
    ageGroup: z.string().optional(),
    region: z.nativeEnum(Region).optional(),
    email: z.string().email().optional(),
    memo: z.string().optional(),
});

export const updateCustomer = async (req: Request, res: Response) => {
    try {
        // 파라미터에서 고객 ID를, 유저 정보에서 회사 ID를 가져옵니다.
        const customerId = parseInt(req.params.id!);
        const companyId = req.user?.companyId;

        if (!companyId) {
            return res.status(401).json({ message: '인증된 사용자 정보가 없습니다.' });
        }
        if (isNaN(customerId)) {
            return res.status(400).json({ message: '유효하지 않은 고객ID입니다.' });
        }
        // Request body 유효성 검사
        const validatedData = updateCustomerSchema.parse(req.body);
        const dataForUpdate = Object.fromEntries(
            Object.entries(validatedData).filter(([_, v]) => v !== undefined)
        );

        // 고객, 회사ID 모두 일치하는 데이터만 업데이트합니다.
        const updatedCustomers = await prisma.customers.updateMany({
            where: {
                id: customerId,
                companyId: companyId,
            },
            data: dataForUpdate,
        });
        // 업데이트된 데이터가 없으면 404 에러를 반환합니다.
        if (updatedCustomers.count === 0) {
            return res.status(404).json({ message: '없는 고객이거나 수정할 권환이 없습니다.' });
        }
        // 성공적으로 업데이트된 정보를 다시 조회해서 반환합니다.
        const result = await prisma.customers.findUnique({
            where: { id: customerId }
        });

        res.status(200).json(result);

    }   catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({ message: '입력한 데이터가 유효하지 않습니다.', errors: error.issues });
        }
        console.error(error);
        res.status(500).json({ message: '서버 내부 오류가 발생하였습니다.' });
    }
};