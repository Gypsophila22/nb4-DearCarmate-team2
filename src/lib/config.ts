import * as dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

dotenv.config({
  path: path.resolve(process.cwd(), '.env'),
  override: false,
});
const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  // Server
  PORT: z.coerce.number().int().positive().default(4000),

  // DB
  DATABASE_URL: z.url(),

  // JWT
  ACCESS_TOKEN_SECRET: z.string().min(16),
  REFRESH_TOKEN_SECRET: z.string().min(16),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // Mail
  // EMAIL_SERVICE: z.string(),
  // EMAIL_USER: z.email(),
  // EMAIL_PASS: z.string().min(1),
  // MAIL_FROM: z.email().optional(),

  EMAIL_PROVIDER: z.literal('resend'),
  RESEND_API_KEY: z.string().startsWith('re_'),

  // 기타 필요한 것들...
});
const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues;
  console.error('[ENV ERROR] Missing/Invalid environment variables:');
  for (const i of issues) {
    const key = i.path.length ? i.path.join('.') : '(root)';
    console.error(`- ${key}: ${i.message}`);
  }
  process.exit(1);
}

export const config = parsed.data;
