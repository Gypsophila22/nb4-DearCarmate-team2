import { CreateCarsRequestDto } from '../dtos/createCarsRequestDto.js';
import { createCarsSerialize } from '../serializers/car.serializer.create.js';
import { createCarsService } from '../services/car.service.create.js';

import type { Request, Response, NextFunction } from 'express';

export const createCarsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //req.user가 사실 없으면 auth 미들웨어에서 걸러집니다. 굳이 중복해서 체크할 필요는 없을 것 같아요.
    //다른 파일도 검증이 있는데, 코멘트는 여기만 남기도록 할게요
    //FIXME: 로그인을 안 할 경우 컨트롤러 실행 전에 끝남 (에러 메시지 로그인이 필요합니다가 아닌 Unauthorized 응답됨)
    if (!req.user) {
      return res.status(401).json({ message: '로그인이 필요합니다.' });
    }
    //저 개인적으론 검증이 미들웨어에 따로 붙어있는 쪽이 나을 것 같습니다. 다른 분들한테도 그렇게 설명해드리고 있어요
    const dto = CreateCarsRequestDto.parse(req.body); // 요청 바디 DTO 검증

    //DB 관련된 부분은 서비스가 아니라 레포지토리에서 접근해야 합니다.
    const car = await createCarsService(dto); // 차량 생성 서비스 실행

    const carWithModel = {
      ...car,
      carModel: {
        id: car.carModel.id,
        type: car.carModel.type,
        manufacturer: car.carModel.manufacturer,
        model: car.carModel.model,
      },
    };
    //저 개인적으로는 DB에서 생성되어서 이미 정렬된 값을 한번 더 검증하는 건 좀 과한 감이 있지 않나 싶습니다.
    return res.status(201).json(createCarsSerialize(carWithModel)); // 생성된 차량 데이터 반환
  } catch (err) {
    next(err);
  }
};
