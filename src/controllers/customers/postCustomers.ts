import { PrismaClient, Gender, Region } from '../../../generated/prisma/index.js';
import type { Request, Response } from 'express';
import { z, ZodError } from 'zod';

const prisma = new PrismaClient();

import { AuthRequest } from '../../types.js';

// zod 유효성 검사
const customersSchema = z.object({
    name: z.string().min(1, { message: '고객명은 필수입니다.' }),
    gender: z.nativeEnum(Gender),
    phoneNumber: z.string().min(1, { message: '연락처는 필수입니다.' }),
    ageGroup: z.string().optional(),
    region: z.nativeEnum(Region).optional(),
    email: z.string().email({ message: '유효하지 않은 이메일 형식입니다.' }).optional(),
    memo: z.string().optional(),
});

export const postCustomers = async (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    try {
        // 요청 데이터 유효성 검사
        const validatedData = customersSchema.parse(req.body);

        // 인증된 사용자 회사 ID 가져오기
        const companyId = authReq.user?.companyId;
        if (!companyId) {
            return res.status(401).json({ message: '인증된 사용자 정보가 없습니다.' });
        }
        // 데이터베이스에 고객 정보 생성
        const newCustomer = await prisma.customers.create({
            data: {
                ...validatedData,
                company: {
                    connect: { id: companyId },
                    },
                },
        });

        // 성공 응답
        res.status(201).json(newCustomer);
    }   catch (error) {
        // 에러 처리
        if (error instanceof ZodError) {
            return res.status(400).json({ message: '입력한 데이터가 유효하지 않습니다.', errors: error.issues });
        }
        console.error(error);
        res.status(500).json({ message: '서버 내부 오류가 발생하였습니다.' });
    }
};