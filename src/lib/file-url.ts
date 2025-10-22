import path from 'path';

/** 서버 외부에서 접근 가능한 절대 URL 생성 */
export function buildPublicUrl(relativePath: string) {
  // 예: relativePath = "contract-documents/1761-abc.pdf"
  const base = process.env.PUBLIC_BASE_URL || 'http://localhost:4000';
  return `${base.replace(/\/$/, '')}/uploads/${relativePath.replace(/^\/+/, '')}`;
}

/** 업로드 디렉터리 기준의 절대 파일경로 반환 (서버 내부 파일 접근용) */
export function resolveUploadAbsPath(relativePath: string) {
  // /app/uploads/<relativePath>
  return path.join(process.cwd(), 'uploads', relativePath);
}
