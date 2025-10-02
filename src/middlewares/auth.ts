import jwt from 'jsonwebtoken';
import type { JwtPayload } from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma/index.js';
import type { Request, Response, NextFunction } from 'express';

const prisma = new PrismaClient();

import type { AuthRequest } from '../types.js';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        //JWT_SECRET이 없는 경우 서버 에러 처리
        console.error('JWT_SECRET is not defined');
        return res.status(500).json({ message: '서버 설정 오류' });
    }
    
    if (req.headers.authorization && req.headers.authorization?.startsWith('Bearer')) {
        try {

            // 헤더에서 토큰 추출
            const token = req.headers.authorization.split(' ')[1];

            // 토큰이 실제로 존재하는지 확인하는 코드
            if (!token) {
                return res.status(401).json({ message: '토큰 형식이 잘못되었습니다.' });
            }
            
            // 토큰 검증
            const decoded = jwt.verify(token, secret) as JwtPayload;

            // decoded가 객체이며 id 속성을 가졌는지 확인
            if (typeof decoded !== 'object' || !('id' in decoded) || typeof decoded.id !== 'number') {
                return res.status(401).json({ message: '유효하지 않은 토큰 페이로드입니다.'});
            }

            // 토큰 user ID로 DB에서 사용자 조회
            const currentUser = await prisma.users.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    companyId: true,
                },
            });

            if (!currentUser) {
                return res.status(401).json({ message: '사용자를 찾을 수 없습니다.' });
            }

            // req 객체에 user 정보 주입
            authReq.user = currentUser;
            return next();
        }   catch (error) {
            console.error(error);
            return res.status(401).json({ message: '유효하지 않은 토큰입니다. 인증에 실패하였습니다.' });
        }
    }
      
    return res.status(401).json({ message: '토큰이 존재하지 않습니다. 인증에 실패하였습니다.' });
    }