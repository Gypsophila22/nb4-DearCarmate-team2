import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
    user? : {
        id: number;
        companyId: number;
    };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token;

    if (req.header.authorization && req.headers.authorization?.startsWith('Bearer')) {
        try {
            // 헤더에서 토큰 추출
            token = req.headers.authorization.split(' ')[1];

            // 토큰 검증
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };

            // 토큰 user ID로 DB에서 사용자 조회
            const currentUser = await prisma.users/.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    companyId: true
                },
            });

            if (!currentUser) {
                return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
            }

            // req 객체에 user 정보 주입
            req.user = currentUser;
            next();
        }   catch (error) {
            console.error(error);
            return res.status(401).json({ message: '유효하지 않은 토큰입니다. 인증에 실패하였습니다.' });
        }
    }
    
    if (!token) {
        return res.status(401).json({ message: '토큰이 존재하지 않습니다. 인증에 실패하였습니다.' });
    }
};