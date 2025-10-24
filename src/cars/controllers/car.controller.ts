import createError from 'http-errors';

import { CarIdParam, GetCarsListQuery } from '../schemas/car.schema.js';
import carService from '../services/index.js';

import type { NextFunction, Request, Response } from 'express';
class CarController {
  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const car = await carService.create(req.body); // 차량 생성 서비스 실행
      res.status(201).json({
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

  uploadCsv = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // 업로드 파일 확인
      if (!req.file) {
        throw createError(400, 'CSV 파일이 업로드되지 않았습니다');
      }
      // 차량 csv 파일 업로드 서비스 호출 (차량 추가)
      await carService.uploadCsv(req.file.buffer);
      res.status(201).json({ message: '성공적으로 등록되었습니다' });
    } catch (err) {
      next(err);
    }
  };

  deleteCar = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const parsed = CarIdParam.safeParse(req.params);
      if (!parsed.success) {
        throw createError(400, '잘못된 차량 ID입니다');
      }
      const carId = parsed.data.carId;
      await carService.delete(carId);
      res.status(200).json({ message: '차량 삭제 성공' });
    } catch (err) {
      next(err);
    }
  };

  getCarById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CarIdParam.safeParse(req.params);
      if (!parsed.success) {
        throw createError(400, '잘못된 차량 ID입니다');
      }
      const carId = parsed.data.carId;
      // 차량 조회 서비스 호출 (carModel 관계 포함)
      const car = await carService.getById(carId);
      if (!car) {
        throw createError(404, '차량을 찾을 수 없습니다');
      }

      // 조회 결과 반환
      res.status(200).json({
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

  getCarModels = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await carService.getModel();
      res.status(200).json({ data: result });
    } catch (err) {
      next(err);
    }
  };

  getCarsList = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = GetCarsListQuery.parse(req.query);
      const { cars, totalItemCount } = await carService.list(parsed); // 차량 목록 조회 서비스 실행

      const currentPage = req.query['page'];
      const pageSize = req.query['pageSize'];

      const totalPages = Math.ceil(totalItemCount / Number(pageSize));

      const result = {
        currentPage,
        totalPages,
        totalItemCount,
        data: cars.map((car) => ({
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
        })),
      };
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  updateCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = CarIdParam.safeParse(req.params);
      if (!parsed.success) {
        throw createError(400, '잘못된 차량 ID입니다');
      }
      const carId = parsed.data.carId;
      const result = await carService.update(carId, req.body);

      // 업데이트 결과 반환
      res.status(200).json({
        id: result.id,
        carNumber: result.carNumber,
        manufacturer: result.carModel.manufacturer,
        model: result.carModel.model,
        type: result.carModel.type,
        manufacturingYear: result.manufacturingYear,
        mileage: result.mileage,
        price: result.price,
        accidentCount: result.accidentCount,
        explanation: result.explanation,
        accidentDetails: result.accidentDetails,
        status: result.status,
      });
    } catch (err) {
      next(err);
    }
  };
}
export const carController = new CarController();
