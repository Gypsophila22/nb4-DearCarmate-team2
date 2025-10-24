import { customerRepository } from '../repositories/customer.repository.js';
import createError from 'http-errors';

export const customerDeleteService = {
  deleteCustomer: async (id: number, companyId: number) => {
    const deleted = await customerRepository.delete(id, companyId);

    if (deleted.count === 0) {
      throw createError(404, '없는 고객이거나 삭제할 권한이 없습니다.');
    }

    return { message: '고객 정보가 성공적으로 삭제되었습니다.' };
  },
};
