import type { Request, Response, NextFunction } from "express";

async function getCompanyUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { companyId } = req.params;
    const { page = "1", pageSize = "10", searchBy, keyword } = req.query;

    //임시 파일입니다.
    return res.json({
      currentPage: Number(page),
      totalPages: 1,
      totalItemCount: 1,
      data: [
        {
          id: 1,
          name: "홍길동",
          email: "hong@example.com",
          employeeNumber: "E1234",
          phoneNumber: "010-1234-5678",
          company: { companyName: "테스트회사" },
        },
      ],
    });
  } catch (err) {
    next(err);
  }
}

export default { getCompanyUsers };
