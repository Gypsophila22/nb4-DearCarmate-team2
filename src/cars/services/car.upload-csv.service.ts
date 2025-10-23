import carDto from '../dtos/index.js';
import carRepository from '../repositories/index.js';
import createError from 'http-errors';
import csv from 'csv-parser';
import prisma from '../../lib/prisma.js';
import { CarStatus, CarType } from '@prisma/client';
import { Readable } from 'stream';
import { z } from 'zod';
import type { CarModel } from '@prisma/client';
/**
 * CSV 파일 업로드로 차량 대용량 등록
 * @param csvBuffer
 * @returns
 */

export const carUploadCsvService = async (csvBuffer: Buffer) => {
  type CarCsvRecord = z.infer<typeof carDto.createCarsRequest>;
  const records: CarCsvRecord[] = [];

  const stream = Readable.from(csvBuffer.toString('utf-8'));

  // CSV 파싱 및 헤더 유효성 검사
  await new Promise<void>((resolve, reject) => {
    stream
      .pipe(csv())
      .on('data', (data) => records.push(data))
      .on('end', () => {
        if (records.length === 0) {
          return reject(createError('CSV 파일이 비어 있습니다'));
        }

        const firstRecord = records[0]!;
        const requiredHeaders = [
          'carNumber',
          'manufacturer',
          'model',
          'manufacturingYear',
          'mileage',
          'price',
          'accidentCount',
          'explanation',
          'accidentDetails',
        ];

        const hasAllHeaders = requiredHeaders.every((h) => h in firstRecord);
        if (!hasAllHeaders) {
          return reject(createError(400, 'CSV 파일 헤더가 잘못되었습니다'));
        }
        resolve();
      })
      .on('error', (err) =>
        reject(
          createError(
            400,
            err instanceof Error ? err.message : 'CSV 파싱 중 오류',
          ),
        ),
      );
  });
  // 차량 번호 중복 체크
  const carNumbersInCsv = records.map((r) => r.carNumber.trim());
  const existingCars =
    await carRepository.findManyByCarNumbers(carNumbersInCsv);
  if (existingCars.length > 0) {
    const duplicateNumbers = existingCars.map((c) => c.carNumber).join(', ');
    throw createError(
      400,
      `이미 존재하는 차량 번호가 있습니다: ${duplicateNumbers}`,
    );
  }

  // 차량 모델 추출 (중복 제거)
  const uniqueModels = Array.from(
    new Map(records.map((r) => [`${r.manufacturer}|${r.model}`, r])).values(),
  );

  // 기존 모델 조회
  const existingModels = await carRepository.findManyModel(uniqueModels);

  // 기존 모델 Set
  const existingKeys = new Set(
    existingModels.map((m) => `${m.manufacturer}|${m.model}`),
  );

  // 신규 모델 필터링
  const modelsToCreate = uniqueModels.filter(
    (r) => !existingKeys.has(`${r.manufacturer}|${r.model}`),
  );

  let createdModels: CarModel[] = [];

  await prisma.$transaction(async (tx) => {
    // 신규 모델 생성
    if (modelsToCreate.length > 0) {
      createdModels = await Promise.all(
        modelsToCreate.map((r) =>
          carRepository.createModelTx.create(tx, {
            manufacturer: r.manufacturer,
            model: r.model,
            type: CarType.세단, // 기본값
          }),
        ),
      );
    }

    // 모델 ID 매핑
    const allModels = [...existingModels, ...(createdModels ?? [])];
    const modelMap = new Map(
      allModels.map((m) => [`${m.manufacturer}|${m.model}`, m.id]),
    );

    // 차량 등록 데이터 구성
    const carsToCreate = records.map((record) => ({
      carNumber: record.carNumber.trim(),
      manufacturingYear: Number(record.manufacturingYear),
      mileage: Number(record.mileage),
      price: Number(record.price),
      accidentCount: Number(record.accidentCount || 0),
      explanation: record.explanation?.trim() || '',
      accidentDetails: record.accidentDetails?.trim() || '',
      modelId: modelMap.get(`${record.manufacturer}|${record.model}`)!,
      status: CarStatus.possession,
    }));

    // 차량 대량 등록
    await carRepository.createManyTx(tx, carsToCreate);
  });
};
