declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name: string;
      isAdmin: boolean;
      companyId: number;
    }

    interface Request {
      validated: any;
    }
  }
}
export {};
