import type { Request, Response, NextFunction } from "express";
import createError from 'http-errors';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { z } from 'zod';
import { customerUploadService } from '../services/customer.upload.service.js';

// 파일을 메모리 저장소에 임시 저장
const upload = multer({ storage: multer.memoryStorage() });
export { upload };

const customerCsvRowSchema = z.object({
    고객명: z.string().min(1, '고객명은 필수입니다.'),
    성별: z.enum
    (['MALE', 'FEMALE'], { message: '성별은 MALE 또는 FEMALE이어야 합니다.'}),
    연락처: z.string().regex(/^\d{2,4}-\d{3,4}-\d{4}$|^\d{9,11}$/, '유효한 연락처 형식이 아닙니다.'),
    연령대: z.string().optional(), // '20대', '30대' 등등
    이메일: z.string().email('유효한 이메일 형식이 아닙니다.').optional(),
    메모: z.string().optional(),
});

// CSV 파싱 및 유효성 검사 
async function parseAndValidateCsv(buffer: Buffer) {
    const results: z.infer<typeof customerCsvRowSchema>[] = [];
    const errors: { row: number; data: any; errors: z.ZodIssue[] }[] = [];
    let rowNumber = 1;

    const stream = Readable.from(buffer);

    await new Promise<void>((resolve, reject) => {
        stream
            .pipe(csv())
            .on('data', (data) => {
                rowNumber++;
                const parsed = customerCsvRowSchema.safeParse(data);
                if (parsed.success) {
                    results.push(parsed.data);
                }   else {
                    errors.push({ row: rowNumber, data, errors: parsed.error.issues });
                }
            })
            
            .on('end', () => {
                resolve();
            })
            .on('error', (error) => {
                reject(createError(400, 'CSV 파싱 오류: ${error.message}'));
            });
    });

    return { results, errors };
}

export const uploadCustomers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        
        // 파일 존재 확인
        if (!req.file) {
            throw createError(400, '업로드된 파일이 없습니다.');
        }

        // CSV 파일인지 확인
        if (req.file.mimetype !== 'text/csv') {
            throw createError(400, 'CSV 파일만 업로드할 수 있습니다');
        }

        const csvBuffer = req.file.buffer; // Buffer로 가져옴
        
        // CSV 파싱, 유효성 검사
        const { results: validCustomers, errors: validationErrors } = await parseAndValidateCsv(csvBuffer);

        const dbProcessResults = await customerUploadService.processCustomerCsv(validCustomers);
    

        res.status(200).json({
            message: 'CSV 파일 업로드 요청을 받았습니다.',
            fileName: req.file.originalname,
            totalRecords: validCustomers.length + validationErrors.length,
            processedSuccessfully: validCustomers.length,
            failedRecords: validationErrors.length,
            validationErrors: validationErrors,
            databaseErrors: dbProcessResults.errors,
        });

    } catch (error) {
      next(error);
    }
};