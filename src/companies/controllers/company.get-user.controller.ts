// src/companies/controllers/company.get-user.controller.ts
import type { Request, Response, NextFunction } from 'express';
import companyService from '../services/index.js';

export const getCompanyUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, pageSize, searchBy, keyword } = req.query as any;

    const result = await companyService.getCompanyUsersService(
      Number(page),
      Number(pageSize),
      searchBy,
      keyword,
    );

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
