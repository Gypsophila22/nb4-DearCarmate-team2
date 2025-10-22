import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Request } from 'express';
import createError from 'http-errors';

const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

// 디렉토리 없으면 생성
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    const stamp = Date.now();
    cb(null, `${base}-${stamp}${ext}`);
  },
});

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  // 허용 확장자 (jpeg, png, webp, gif)
  const ok = /image\/(jpeg|png|webp|gif)/.test(file.mimetype);
  if (!ok) return cb(createError(415, '이미지 파일만 업로드할 수 있습니다.'));
  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

// 업로드된 파일 접근용 URL 생성 헬퍼
export function buildImageUrl(req: Request, filename: string) {
  const proto = req.headers['x-forwarded-proto']?.toString() || req.protocol;
  const host = req.headers['x-forwarded-host']?.toString() || req.get('host');
  return `${proto}://${host}/uploads/${encodeURIComponent(filename)}`;
}
