import type { CreateCustomerBody } from '../schemas/customer.schema.js';
import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { customerCreateService } from '../services/customer.create.service.js';

export const createCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      throw createError(401, '인증된 사용자 정보가 없습니다.');
    }

    const body = res.locals.body as CreateCustomerBody;

    const newCustomer = await customerCreateService.createCustomer(
      body,
      companyId,
    );

    return res.status(201).json(newCustomer);
  } catch (error) {
    next(error);
  }
};
