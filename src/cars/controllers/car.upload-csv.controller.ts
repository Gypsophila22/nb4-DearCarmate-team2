<<<<<<< HEAD
import carService from "../services/index.js";

import type { NextFunction, Request, Response } from "express";
=======
import carService from '../services/index.js';

import type { NextFunction, Request, Response } from 'express';
>>>>>>> develop

// 차량 csv 업로드 컨트롤러
export const carUploadCsvController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // 업로드 파일 확인
    if (!req.file) {
<<<<<<< HEAD
      return res.status(400).json({ message: "잘못된 요청입니다" });
=======
      return res.status(400).json({ message: '잘못된 요청입니다' });
>>>>>>> develop
    }

    // 차량 csv 파일 업로드 서비스 호출 (차량 추가)
    const result = await carService.uploadCsv(req.file.buffer);

    if (result.success) {
<<<<<<< HEAD
      return res.status(201).json({ message: "성공적으로 등록되었습니다" });
    } else {
      return res.status(400).json({ message: "잘못된 요청입니다" });
=======
      return res.status(201).json({ message: '성공적으로 등록되었습니다' });
    } else {
      return res.status(400).json({ message: '잘못된 요청입니다' });
>>>>>>> develop
    }
  } catch (err) {
    next(err);
  }
};
