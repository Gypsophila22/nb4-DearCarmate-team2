import jwt from 'jsonwebtoken';
const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
class PostRefresh {
    async refresh(req, res) {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: '잘못된 요청입니다' });
        }
        try {
            const decoded = jwt.verify(refreshToken, REFRESH_SECRET);
            const accessToken = jwt.sign({ id: decoded.id }, ACCESS_SECRET, {
                expiresIn: '1h',
            });
            const newRefreshToken = jwt.sign({ id: decoded.id }, REFRESH_SECRET, {
                expiresIn: '7d',
            });
            return res.json({ accessToken, refreshToken: newRefreshToken });
        }
        catch (err) {
            return res.status(401).json({ message: '유효하지 않은 토큰' });
        }
    }
}
export default new PostRefresh();
//# sourceMappingURL=postRefresh.js.map