import { PrismaClient } from '../../../generated/prisma/index.js';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();
class PatchUser {
    async patchMe(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({ message: '로그인이 필요합니다.' });
            }
            const { employeeNumber, phoneNumber, currentPassword, password, passwordConfirmation, imageUrl, } = req.body;
            // 유저 확인
            const user = await prisma.users.findUnique({
                where: { id: req.user.id },
            });
            if (!user)
                return res.status(404).json({ message: '존재하지 않는 유저입니다.' });
            // currentPassword 검증
            const match = await bcrypt.compare(currentPassword, user.password);
            if (!match) {
                return res
                    .status(400)
                    .json({ message: '현재 비밀번호가 맞지 않습니다.' });
            }
            // 수정 데이터 준비
            const dataToUpdate = {};
            if (employeeNumber)
                dataToUpdate.employeeNumber = employeeNumber;
            if (phoneNumber)
                dataToUpdate.phoneNumber = phoneNumber;
            if (imageUrl)
                dataToUpdate.imageUrl = imageUrl;
            // 새 비밀번호 있는 경우만 업데이트
            if (password) {
                if (password !== passwordConfirmation) {
                    return res
                        .status(400)
                        .json({ message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
                }
                dataToUpdate.password = await bcrypt.hash(password, 10);
            }
            // 업데이트
            const updated = await prisma.users.update({
                where: { id: user.id },
                data: dataToUpdate,
            });
            const { password: _, ...safeUser } = updated;
            return res.json(safeUser);
        }
        catch (e) {
            return res.status(500).json({ message: '서버 에러.' });
        }
    }
}
export default new PatchUser();
//# sourceMappingURL=patchUser.js.map