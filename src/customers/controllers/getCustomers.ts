import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import { customerGetService } from '../services/customer.get.service.js';
import type { GetCustomersQuery } from '../schemas/customers.schema.js';

interface ValidatedRequest extends Request {
  validated?: {
    query?: GetCustomersQuery;
  };
}

export const getCustomers = async (
  req: ValidatedRequest,
  res: Response,
  next: NextFunction,
) => {
  console.log('getCustomers controller: Start'); // Log 1
  try {
    const companyId = req.user?.companyId;
    console.log('getCustomers controller: companyId =', companyId); // Log 2
    if (!companyId) {
      throw createError(401, '인증된 사용자 정보가 없습니다.');
    }

    const { query } = req.validated!;
    console.log('getCustomers controller: query =', query); // Log 3

    console.log('getCustomers controller: Calling customerGetService.getCustomers'); // Log 4
    const result = await customerGetService.getCustomers(
      companyId,
      query.page,
      query.pageSize,
      query.searchBy,
      query.keyword,
    );
    console.log('getCustomers controller: customerGetService.getCustomers returned'); // Log 5

    return res.status(200).json(result);
  } catch (error) {
    console.error('getCustomers controller: Error caught =', error); // Log 6
    next(error);
  }
};
