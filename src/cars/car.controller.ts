import carService from './services/index.js';
import createError from 'http-errors';
import { CreateCarsRequestDto } from './dtos/createCarsRequestDto.js';
import { createCarsService } from './services/car.service.create.js';

import type { Request, Response, NextFunction } from 'express';

class CarController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw createError(401, '로그인이 필요합니다.');

      //저 개인적으론 검증이 미들웨어에 따로 붙어있는 쪽이 나을 것 같습니다. 다른 분들한테도 그렇게 설명해드리고 있어요
      const dto = CreateCarsRequestDto.parse(req.body); // 요청 바디 DTO 검증
      const car = await createCarsService(dto); // 차량 생성 서비스 실행

      return res.status(201).json({
        id: car.id,
        carNumber: car.carNumber,
        manufacturer: car.carModel.manufacturer,
        model: car.carModel.model,
        type: car.carModel.type,
        manufacturingYear: car.manufacturingYear,
        mileage: car.mileage,
        price: car.price,
        accidentCount: car.accidentCount,
        explanation: car.explanation,
        accidentDetails: car.accidentDetails,
        status: car.status,
      });
    } catch (err) {
      next(err);
    }
  };
  uploadCsv = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 업로드 파일 확인
      if (!req.file) {
        throw createError(400, 'CSV 파일이 업로드되지 않았습니다');
      }

      // 차량 csv 파일 업로드 서비스 호출 (차량 추가)
      await carService.uploadCsv(req.file.buffer);

      return res.status(201).json({ message: '성공적으로 등록되었습니다' });
    } catch (err) {
      next(err);
    }
  };
}

export const carController = new CarController();
