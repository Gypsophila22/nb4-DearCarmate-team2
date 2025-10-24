import { contractRepository } from '../repositories/contract.repository.js';

export const getUsersListForContractService = async () => {
  // repository 함수 호출
  const users = await contractRepository.getUsers();
  // '이름(이메일)' 형태로 변환

  const result = users.map((c) => ({
    id: c.id,
    data: `${c.name}(${c.email ?? ''})`,
  }));

  return result;
};
