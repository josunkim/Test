"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../../prismaClient");
const client_1 = require("@prisma/client");
/**
 * @swagger
 * /api/applications:
 *   get:
 *     tags:
 *       - Applications
 *     summary: 지원 현황 조회
 *     description: 로그인한 사용자의 지원 내역을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: "조회할 페이지 번호 (기본값: 1)"
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: filter
 *         required: false
 *         description: "지원 상태 필터 (기본값: all)"
 *         schema:
 *           type: string
 *           enum: [all, PENDING, ACCEPTED, REJECTED]
 *     responses:
 *       200:
 *         description: 지원 현황 반환
 *       401:
 *         description: 인증 실패 (사용자를 찾을 수 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "일치하는 userId가 없습니다."
 *       404:
 *         description: 지원 내역을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: []
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 0
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 에러입니다."
 */
const getApplicationList = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: "일치하는 userId가 없습니다." });
        }
        const page = Number(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const filter = req.query.filter || "all"; // (기본값: 전체)
        //filter가 없거나 all일때는 user가 지원한 기업 전체 조회
        let whereCondition = {
            userId,
        };
        const isApplicationStatus = Object.values(client_1.ApplicationStatus).includes(filter.toUpperCase());
        //filter가 enum값에 해당하면 status 일치하는 데이터 조회
        if (filter !== "all" && isApplicationStatus) {
            whereCondition.status = filter.toUpperCase();
        }
        //userApplications 조회
        const applications = await prismaClient_1.prisma.userApplications.findMany({
            where: whereCondition,
            orderBy: { createdAt: "desc" }, //지원한 순서 최신 순
            skip,
            take: limit,
        });
        //조회된 companyId 추출
        const companyIds = applications.map((app) => app.companyId);
        //지원한 기업이 없으면 빈 배열 반환하기
        if (companyIds.length === 0) {
            return res.status(200).json({ applications: [], totalPages: 0, page });
        }
        //companies 조회
        const companies = await prismaClient_1.prisma.companies.findMany({
            where: { id: { in: companyIds } },
            select: {
                id: true,
                name: true,
                image: true,
                content: true,
                category: true,
            },
        });
        //기업별 지원자 수 그룹핑
        const applicantCounts = await prismaClient_1.prisma.userApplications.groupBy({
            by: ["companyId"],
            where: { companyId: { in: companyIds } },
            _count: { companyId: true },
        });
        //지원자 수 매핑
        const applicantCountMap = Object.fromEntries(applicantCounts.map((app) => [app.companyId, app._count.companyId]));
        //데이터 병합
        const formattedApplications = companies.map((company) => {
            const application = applications.find((app) => app.companyId === company.id);
            return {
                id: application?.id, //지원서 id
                name: company.name, //기업 이름
                image: company.image, //기업 이미지
                content: company.content, //기업 설명
                category: company.category, //카테고리
                status: application?.status || client_1.ApplicationStatus.PENDING, //지원 상태
                applicantCnt: applicantCountMap[company.id] || 0, //지원자 수
                createdAt: application?.createdAt, //지원 일자
                updatedAt: application?.updatedAt,
            };
        });
        //총 지원 수, 페이지 수 계산
        const totalApplications = await prismaClient_1.prisma.userApplications.count({
            where: whereCondition,
        });
        const totalPages = Math.ceil(totalApplications / limit);
        //요청 성공 시 응답 객체
        const response = {
            applications: formattedApplications,
            page,
            totalPages,
        };
        res.status(200).send(response);
    }
    catch (e) {
        console.log("err:", e);
        res.status(500).send({ message: "서버 에러입니다." });
    }
};
exports.default = getApplicationList;
//# sourceMappingURL=getApplicationList.js.map