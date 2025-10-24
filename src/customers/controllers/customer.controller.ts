import type { Request, Response, NextFunction } from 'express';
import createError from 'http-errors';
import {
  customerCreateService,
  customerGetService,
  customerGetByIdService,
  customerUpdateService,
  customerDeleteService,
  customerUploadService,
  customerParseService,
} from '../services/index.js';
import { customerValidation } from '../schemas/customer.schema.js';
import { z } from 'zod';

type CreateCustomerBody = z.infer<
  ReturnType<typeof customerValidation.getCreateCustomerSchema>
>;
type GetCustomersQuery = z.infer<
  ReturnType<typeof customerValidation.getGetCustomersSchema>
>;
type GetCustomerByIdParams = z.infer<
  ReturnType<typeof customerValidation.getGetCustomerByIdSchema>
>;
type UpdateCustomerParams = z.infer<
  ReturnType<typeof customerValidation.getUpdateCustomerParamsSchema>
>;
type UpdateCustomerBody = z.infer<
  ReturnType<typeof customerValidation.getUpdateCustomerBodySchema>
>;
type DeleteCustomerParams = z.infer<
  ReturnType<typeof customerValidation.getDeleteCustomerSchema>
>;

import type {
  BulkUploadResponse,
  CustomerCsvValidationError,
} from '../services/customer.upload.service.js';

class CustomerController {
  async createCustomer(req: Request, res: Response, next: NextFunction) {
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
  }

  async getCustomers(req: Request, res: Response, next: NextFunction) {
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
  }

  async getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw createError(401, '인증된 사용자 정보가 없습니다.');
      }

      const params = res.locals.params as GetCustomerByIdParams;

      const customer = await customerGetByIdService.getCustomerById(
        params.id,
        companyId,
      );

      return res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  }

  async updateCustomer(req: Request, res: Response, next: NextFunction) {
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
  }

  async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw createError(401, '인증된 사용자 정보가 없습니다.');
      }

      const params = res.locals.params as DeleteCustomerParams;

      const result = await customerDeleteService.deleteCustomer(
        params.id,
        companyId,
      );

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  // New method
  async uploadCustomers(
    req: Request,
    res: Response<BulkUploadResponse>,
    next: NextFunction,
  ) {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw createError(401, '인증된 사용자 정보가 없습니다.');
      }

      // 파일 존재 확인
      if (!req.file) {
        throw createError(400, '업로드된 파일이 없습니다.');
      }

      // CSV 파일인지 확인
      if (req.file.mimetype !== 'text/csv') {
        throw createError(400, 'CSV 파일만 업로드할 수 있습니다');
      }

      const csvBuffer = req.file.buffer; // Buffer로 가져옴
      const fileName = req.file.originalname;

      // CSV 파싱, 유효성 검사
      const { results: validCustomers, errors: parseValidationErrors } =
        await customerParseService.parseAndValidateCsv(csvBuffer);

      const mappedValidationErrors: CustomerCsvValidationError[] =
        parseValidationErrors.map((err) => ({
          row: err.row,
          data: err.data,
          errors: err.errors.map((issue) => ({
            message: issue.message,
            path: issue.path,
            code: issue.code,
          })),
        }));

      const dbProcessResults = await customerUploadService.processCustomerCsv(
        validCustomers,
        companyId,
        fileName,
      );

      const totalRecords = validCustomers.length + parseValidationErrors.length;
      const failedRecords =
        mappedValidationErrors.length + dbProcessResults.databaseErrors.length;

      return res.status(200).json({
        message: 'CSV 파일 업로드 요청을 받았습니다.',
        fileName,
        totalRecords,
        processedSuccessfully: dbProcessResults.processedSuccessfully,
        failedRecords,
        validationErrors: mappedValidationErrors,
        databaseErrors: dbProcessResults.databaseErrors,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const customerController = new CustomerController();
