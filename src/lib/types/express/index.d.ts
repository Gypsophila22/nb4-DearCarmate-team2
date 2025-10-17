declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
<<<<<<< HEAD
      name?: string;
      isAdmin?: boolean;
=======
      name: string;
      isAdmin: boolean;
>>>>>>> develop
    }
  }
}
export {};
