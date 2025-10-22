import contractRepository from '../repositories/index.js';

export const getCustomersListForContractService = async () => {
  // repository 함수 호출
  const customers = await contractRepository.getCustomersListForContract();

  // '이름(이메일)' 형태로 변환
  const result = customers.map((c) => ({
    id: c.id,
    data: `${c.name}(${c.email ?? ''})`,
  }));

  return result;
};
