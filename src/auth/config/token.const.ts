export const TOKEN = {
  access: { secret: process.env.ACCESS_TOKEN_SECRET!, expiresIn: '1h' },
  refresh: { secret: process.env.REFRESH_TOKEN_SECRET!, expiresIn: '7d' },
} as const;
