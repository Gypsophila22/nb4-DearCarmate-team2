import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { customerUpdateService } from '../services/customer.update.service.js';
import type {
  UpdateCustomerParams,
  UpdateCustomerBody,
} from '../schemas/customers.schema.js';

export const updateCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      throw createError(401, '인증된 사용자 정보가 없습니다.');
    }

    const { params, body } = req.validated as {
      params: UpdateCustomerParams;
      body: UpdateCustomerBody;
    };

    const result = await customerUpdateService.updateCustomer(
      params.id,
      body,
      companyId,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
