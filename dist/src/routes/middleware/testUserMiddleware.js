"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../../prismaClient");
// 테스트용 미들웨어
const testUserMiddleware = async (req, res, next) => {
    try {
        //XXX: 임의로 가져온 사용자 id
        const testUserId = "d292ec89-4228-47de-8fc4-bcc18003a34c";
        // "d6057330-2469-43dc-a8dd-7a6c18c2361e"
        // "d6e465ad-0068-4c3c-ac69-94dae47d2f2d"
        // "f422310a-01a2-43d7-a218-744359174960"
        // 데이터베이스에 해당 사용자가 존재하는지 확인
        const user = await prismaClient_1.prisma.users.findUnique({
            where: { id: testUserId },
        });
        if (!user) {
            return res
                .status(404)
                .json({ message: "테스트 사용자를 찾을 수 없습니다." });
        }
        // req 객체에 user 정보 추가
        req.user = {
            id: user.id,
            email: user.email,
            name: user.name,
        };
        next();
    }
    catch (error) {
        console.error("Test User Middleware Error:", error);
        res.status(500).json({ message: "서버 에러입니다." });
    }
};
exports.default = testUserMiddleware;
//# sourceMappingURL=testUserMiddleware.js.map