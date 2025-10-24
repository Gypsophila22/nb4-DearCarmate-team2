import multer from 'multer';

// 파일을 메모리 저장소에 임시 저장
const upload = multer({ storage: multer.memoryStorage() });
export { upload };
