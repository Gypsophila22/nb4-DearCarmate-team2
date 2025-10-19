import multer from "multer";
import path from "path";

import type { Request } from "express";

/**
 * Multer 메모리 스토리지 설정
 * - 업로드된 파일을 메모리에 버퍼로 저장
 */
const storage = multer.memoryStorage();

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const ext = path.extname(file.originalname).toLowerCase(); // 파일 확장자 추출
  if (ext === ".csv") cb(null, true); // CSV 파일이면 허용
  else cb(new Error("잘못된 요청입니다")); // 그 외는 에러 처리
};

export const uploadCsvMiddleware = multer({ storage, fileFilter }).single(
  "file",
);
