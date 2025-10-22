import multer from 'multer';
import path from 'path';
import fs from 'fs';
import createError from 'http-errors';

const contractsDir = path.join(process.cwd(), 'uploads', 'contract-documents');
fs.mkdirSync(contractsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, contractsDir),
  filename: (_req, file, cb) => {
    const ts = Date.now();
    const ext = path.extname(file.originalname);
    cb(null, `${ts}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});

export const uploadContract = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'application/pdf') return cb(null, true);
    cb(
      createError(
        400,
        '허용되지 않는 파일 형식입니다. pdf파일을 업로드해 주세요.',
      ),
    );
  },
});
