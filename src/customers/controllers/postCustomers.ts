import type { CreateCustomerBody } from '../schemas/customers.schema.js';
import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { customerCreateService } from '../services/customer.create.service.js';

interface ValidatedRequest extends Request {
  validated?: {
    body?: CreateCustomerBody;
  };
}

export const createCustomer = async (
  req: ValidatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      throw createError(401, '인증된 사용자 정보가 없습니다.');
    }

    const { body } = req.validated!;

    const newCustomer = await customerCreateService.createCustomer(
      body,
      companyId,
    );

    return res.status(201).json(newCustomer);
  } catch (error) {
    next(error);
  }
};
