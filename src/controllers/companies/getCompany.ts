import type { Request, Response, NextFunction } from "express";

// 회사 목록 조회 (GET /admin/companies)
async function getCompany(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = "1", pageSize = "10" } = req.query;

    //임시 더미.
    const items = [
      { id: 1, companyName: "코드카", companyCode: "CARMATE123", userCount: 5, createdAt: new Date().toISOString() },
      { id: 2, companyName: "오토모빌", companyCode: "AUTO456", userCount: 3, createdAt: new Date().toISOString() }
    ];

    const pageInfo = {
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: 1,
      totalItems: items.length
    };

    return res.json({ success: true, data: { items, pageInfo } });
  } catch (err) {
    next(err);
  }
}

export default { getCompany };
