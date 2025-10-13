import prisma from '../../lib/prisma.js';
export const getCustomerById = async (req, res) => {
    try {
        const customerId = parseInt(req.params.id);
        const companyId = req.user?.companyId;
        if (!companyId) {
            return res.status(401).json({ message: '인증된 사용자 정보가 없습니다.' });
        }
        if (isNaN(customerId)) {
            return res.status(400).json({ message: '유효하지 않은 고객ID입니다.' });
        }
        const customer = await prisma.customers.findFirst({
            where: {
                id: customerId,
                companyId: companyId,
            },
        });
        if (!customer) {
            return res.status(404).json({ message: '고객을 찾을 수 없습니다.' });
        }
        res.status(200).json(customer);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 내부 오류가 발생하였습니다.' });
    }
};
//# sourceMappingURL=getCustomerById.js.map