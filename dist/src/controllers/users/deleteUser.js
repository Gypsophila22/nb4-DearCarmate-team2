import { PrismaClient } from '../../../generated/prisma/index.js';
const prisma = new PrismaClient();
class DeleteUser {
    async deleteMe(req, res) {
        if (!req.user) {
            return res.status(401).json({ message: '로그인이 필요합니다.' });
        }
        await prisma.users.delete({
            where: { id: req.user.id },
        });
        return res.json({ message: '유저 삭제 성공.' });
    }
    async deleteUser(req, res) {
        if (!req.user?.isAdmin) {
            return res.status(403).json({ message: '관리자 권한이 필요합니다.' });
        }
        const userId = Number(req.params.id);
        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: '존재하지 않는 유저입니다.' });
        }
        await prisma.users.delete({ where: { id: userId } });
        return res.json({ message: '유저 삭제 성공.' });
    }
}
export default new DeleteUser();
//# sourceMappingURL=deleteUser.js.map