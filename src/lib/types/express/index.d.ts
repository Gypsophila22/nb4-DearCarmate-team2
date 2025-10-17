declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
      isAdmin: boolean;
    }
    interface Request {
      paramsDto?: unknown;
      bodyDto?: unknown;
    }
  }
}
export {};
