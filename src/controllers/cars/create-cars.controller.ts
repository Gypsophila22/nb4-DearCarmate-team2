import { CreateCarRequestDto } from '../../dtos/cars/create-cars-request.dto.js';
import { createCarSerialize } from '../../serializers/cars/create-cars.serializer.js';
import { createCarService } from '../../services/cars/create-cars.service.js';

import type { Request, Response } from 'express';

export const createCarController = async (req: Request, res: Response) => {
  try {
    const dto = CreateCarRequestDto.parse(req.body); // 요청 바디 DTO 검증
    const car = await createCarService(dto); // 차량 생성 서비스 실행
    return res.status(201).json(createCarSerialize(car)); // 생성된 차량 데이터 반환
  } catch (err) {
    return res.status(400).json({
      message: '잘못된 요청입니다',
    });
  }
};
