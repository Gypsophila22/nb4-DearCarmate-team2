import type { Request, Response, NextFunction } from "express";
import createError from 'http-errors';
import multer from 'multer';

// 파일을 메모리 저장소에 임시 저장
const upload = multer({ storage: multer.memoryStorage() });

export const uploadCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        
        if (!req.file) {
            throw createError(400, '업로드된 파일이 없습니다.');
        }

        if (!req.file.mimetype !== 'text/csv') {
            throw createError(400, 'CSV 파일만 업로드할 수 있습니다');
        }

        const csvBuffer = req.file.buffer; // Buffer로 가져옴
        const csvString = csvBuffer.toString('utf-8'); // Buffer를 문자열로 변경

        res.status(200).json({
            message: 'CSV 파일 업로드 요청을 받았습니다.',
            fileName: req.file.originalname,
            fileSize: req.file.size,
        });

    } catch (error) {
        next(error);
    }
};