import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { customerUpdateService } from '../services/customer.update.service.js';
import type {
  UpdateCustomerParams,
  UpdateCustomerBody,
} from '../schemas/customer.schema.js';

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

    const { id } = res.locals.params as UpdateCustomerParams;
    const body = res.locals.body as UpdateCustomerBody;

    const updatedCustomer = await customerUpdateService.updateCustomer(
      id,
      body,
      companyId,
    );

    return res.status(200).json(updatedCustomer);
  } catch (error) {
    next(error);
  }
};
