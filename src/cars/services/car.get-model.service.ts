import { carRepository } from '../repositories/car.repository.js';

export const carGetModelService = async () => {
  // DB에서 모든 차량 모델과 제조사 조회(CarModel 테이블))
  const models = await carRepository.findModelWithManufacturer();

  // 제조사별로 모델 그룹화
  const grouped = models.reduce<{ manufacturer: string; model: string[] }[]>(
    (acc, curr) => {
      // 기존 그룹에 제조사가 존재하는지 확인
      const existing = acc.find(
        (item) => item.manufacturer === curr.manufacturer,
      );
      // 존재하면 모델 리스트에 추가
      if (existing) {
        existing.model.push(curr.model);
      } else {
        // 없으면 새 그룹 생성
        acc.push({ manufacturer: curr.manufacturer, model: [curr.model] });
      }
      return acc;
    },
    [],
  );

  // 데이터 반환
  return grouped;
};
