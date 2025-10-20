import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { customerGetByIdService } from '../services/customer.getById.service.js';
import type { GetCustomerByIdParams } from '../schemas/customers.schema.js';

export const getCustomerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      throw createError(401, '인증된 사용자 정보가 없습니다.');
    }

    const { params } = req.validated as {
      params: GetCustomerByIdParams;
    };

    const customer = await customerGetByIdService.getCustomerById(
      params.id,
      companyId,
    );

    return res.status(200).json(customer);
  } catch (error) {
    next(error);
  }
};
