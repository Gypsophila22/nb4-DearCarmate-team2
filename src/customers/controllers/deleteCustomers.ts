import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { customerDeleteService } from '../services/customer.delete.service.js';
import type { DeleteCustomerParams } from '../schemas/customers.schema.js';

interface ValidatedRequest extends Request {
  validated?: {
    params?: DeleteCustomerParams;
  };
}

export const deleteCustomer = async (
  req: ValidatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      throw createError(401, '인증된 사용자 정보가 없습니다.');
    }

    const { params } = req.validated!;

    const result = await customerDeleteService.deleteCustomer(
      params.id,
      companyId,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
