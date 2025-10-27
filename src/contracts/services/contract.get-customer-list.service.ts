import { contractRepository } from '../repositories/contract.repository.js';

export const contractGetCustomerListService = async () => {
  // repository 함수 호출
  const customers = await contractRepository.getCustomers();

  // '이름(이메일)' 형태로 변환
  const result = customers.map((c) => ({
    id: c.id,
    data: `${c.name}(${c.email ?? ''})`,
  }));

  return result;
};
