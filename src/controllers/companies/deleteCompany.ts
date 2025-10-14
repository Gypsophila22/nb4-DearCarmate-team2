import type { Request, Response, NextFunction } from "express";

async function deleteCompany(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json({ message: "deleteCompany not implemented yet" });
  } catch (err) {
    next(err);
  }
}

export default { deleteCompany };
