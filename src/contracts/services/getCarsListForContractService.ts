import { contractRepository } from '../repositories/contract.repository.js';

export const getCarsListForContractService = async () => {
  // repository 함수 호출
  const cars = await contractRepository.getCarsList();

  // '모델(차량번호)' 형태로 변환
  const result = cars.map((c) => ({
    id: c.id,
    data: `${c.carModel.model}(${c.carNumber ?? ''})`,
  }));

  return result;
};
