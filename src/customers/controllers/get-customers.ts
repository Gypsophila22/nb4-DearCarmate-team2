import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { customerGetService } from '../services/customer.get.service.js';
import type { GetCustomersQuery } from '../schemas/customer.schema.js';

export const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) {
      throw createError(401, '인증된 사용자 정보가 없습니다.');
    }

    const query = res.locals.query as GetCustomersQuery;

    const result = await customerGetService.getCustomers(
      companyId,
      query.page,
      query.pageSize,
      query.searchBy,
      query.keyword,
    );

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
