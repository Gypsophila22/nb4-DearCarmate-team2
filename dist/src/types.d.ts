import type { Request } from 'express';
export interface AuthRequest extends Request {
    user?: {
        id: number;
        companyId: number;
    };
}
//# sourceMappingURL=types.d.ts.map