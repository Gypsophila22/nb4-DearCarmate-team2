import type { Request, Response, NextFunction } from "express";

async function updateCompany(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: Prisma update 로직 추가 예정
    return res.json({ message: "updateCompany not implemented yet" });
  } catch (err) {
    next(err);
  }
}

export default { updateCompany };