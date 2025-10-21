import createError from "http-errors";

import { ContractIdParamSchema } from "../contract.schema.js";
import contractService from "../services/index.js";

import type { NextFunction, Request, Response } from "express";

/**
 * 계약 삭제
 */
export const deleteContractsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paramResult = ContractIdParamSchema.safeParse(req.params);
    if (!paramResult.success) throw createError(400, "잘못된 계약 ID입니다");
    const { contractId } = paramResult.data;

    if (!req.user) throw createError(401, "로그인이 필요합니다.");

    await contractService.delete(contractId, req.user.id);
    return res.status(200).json({ message: "계약 삭제 성공" });
  } catch (err) {
    next(err);
  }
};
