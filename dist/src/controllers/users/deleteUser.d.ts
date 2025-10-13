import type { Request, Response } from 'express';
declare class DeleteUser {
    deleteMe(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    deleteUser(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: DeleteUser;
export default _default;
//# sourceMappingURL=deleteUser.d.ts.map