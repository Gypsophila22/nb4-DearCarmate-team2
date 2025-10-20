<<<<<<< HEAD
import carRepository from "../repositories/index.js";
import csv from "csv-parser";
import { CarStatus, CarType } from "@prisma/client";
import { Readable } from "stream";

import type carDto from "../dtos/index.js";
=======
import carRepository from '../repositories/index.js';
import csv from 'csv-parser';
import { CarStatus, CarType } from '@prisma/client';
import { Readable } from 'stream';

import type carDto from '../dtos/index.js';
>>>>>>> develop
// CSV 차량 생성 (추후 트랜잭션 넣기)
export const carUploadCsvService = async (csvBuffer: Buffer) => {
  try {
    type CarCsvRecord = z.infer<typeof carDto.createCarsRequest>;
    const records: CarCsvRecord[] = [];

    // 버퍼 -> 문자열 -> 스트림 변환
<<<<<<< HEAD
    const stream = Readable.from(csvBuffer.toString("utf-8"));
=======
    const stream = Readable.from(csvBuffer.toString('utf-8'));
>>>>>>> develop

    // csv-parser로 csv를 records 배열에 저장
    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csv()) // csv 각 행을 객체로 변환
<<<<<<< HEAD
        .on("data", (data) => records.push(data)) // 한 행씩 push
        .on("end", resolve) // 모든 행 파싱 완료
        .on("error", reject); // 오류 발생 시 reject
=======
        .on('data', (data) => records.push(data)) // 한 행씩 push
        .on('end', resolve) // 모든 행 파싱 완료
        .on('error', reject); // 오류 발생 시 reject
>>>>>>> develop
    });

    const carsToCreate = []; // 차량 데이터 모음

    for (const record of records) {
      const manufacturer = record.manufacturer.trim();
      const model = record.model.trim();

      // 차량 모델 확인 레포지토리 호출
      let carModel = await carRepository.findModel.findByManufacturerAndModel(
        manufacturer,
        model,
      );
      // 모델이 없으면 생성 레포지토리 호출
      if (!carModel) {
        carModel = await carRepository.createModel.create({
          manufacturer,
          model,
          type: CarType.세단, // 기본값
        });
      }

      // createMany용 배열에 추가
      carsToCreate.push({
        carNumber: record.carNumber.trim(),
        manufacturingYear: Number(record.manufacturingYear),
        mileage: Number(record.mileage),
        price: Number(record.price),
        accidentCount: Number(record.accidentCount),
<<<<<<< HEAD
        explanation: record.explanation?.trim() || "",
        accidentDetails: record.accidentDetails?.trim() || "",
=======
        explanation: record.explanation?.trim() || '',
        accidentDetails: record.accidentDetails?.trim() || '',
>>>>>>> develop
        modelId: carModel.id,
        status: CarStatus.possession,
      });
    }
    // 차량 생성 레포지토리 호출
    await carRepository.createMany(carsToCreate);

    return { success: true };
  } catch (err) {
    return { success: false };
  }
};
