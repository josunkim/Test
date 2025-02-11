"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../../prismaClient");
const client_1 = require("@prisma/client");
/**
 * 메인 페이지에 표시될 회사 목록을 조회하는 함수
 * @param req - Express Request 객체
 * @param res - Express Response 객체
 * @returns 회사 목록 또는 에러 응답
 */
const getMainCompanyList = async (req, res) => {
    try {
        // 기본 파라미터 설정
        const page = Number(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        const filter = req.query.filter || "revenueDesc";
        const search = req.query.search || "";
        // 기본 where 조건
        let whereCondition = {
            deletedAt: null,
        };
        // 검색어가 있는 경우 조건 추가
        if (search) {
            whereCondition.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
                {
                    category: {
                        some: { category: { contains: search, mode: "insensitive" } },
                    },
                },
            ];
        }
        // 정렬 조건
        const orderBy = filter === "revenueDesc"
            ? { salesRevenue: client_1.Prisma.SortOrder.desc }
            : filter === "revenueAsc"
                ? { salesRevenue: client_1.Prisma.SortOrder.asc }
                : filter === "employeeDesc"
                    ? { employeeCnt: client_1.Prisma.SortOrder.desc }
                    : filter === "employeeAsc"
                        ? { employeeCnt: client_1.Prisma.SortOrder.asc }
                        : { salesRevenue: client_1.Prisma.SortOrder.desc };
        // 회사 목록 조회
        const companies = await prismaClient_1.prisma.companies.findMany({
            where: whereCondition,
            orderBy,
            skip,
            take: limit,
            select: {
                id: true,
                idx: true,
                name: true,
                image: true,
                content: true,
                category: {
                    select: {
                        id: true,
                        category: true,
                    },
                },
                salesRevenue: true,
                employeeCnt: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        // 지원자 수 조회
        const applicantCounts = await prismaClient_1.prisma.userApplications.groupBy({
            by: ["companyId"],
            where: { companyId: { in: companies.map((c) => c.id) } },
            _count: { companyId: true },
        });
        const applicantCountMap = Object.fromEntries(applicantCounts.map((app) => [app.companyId, app._count.companyId]));
        // 응답 데이터 구성
        const totalCompanies = await prismaClient_1.prisma.companies.count({
            where: whereCondition,
        });
        const totalPages = Math.ceil(totalCompanies / limit);
        const response = {
            companies: companies.map((company) => ({
                id: company.id,
                idx: String(company.idx),
                name: company.name,
                image: company.image || undefined,
                content: company.content,
                category: company.category,
                salesRevenue: company.salesRevenue.toString(),
                employeeCnt: company.employeeCnt,
                applicantCnt: applicantCountMap[company.id] || 0,
                createdAt: company.createdAt.toISOString(),
                updatedAt: company.updatedAt.toISOString(),
            })),
            page,
            totalPages,
        };
        return res.status(200).json(response);
    }
    catch (e) {
        console.error("Error in getMainCompanyList:", e);
        return res.status(500).json({
            message: "서버 에러가 발생했습니다.",
            error: process.env.NODE_ENV === "development" ? e.message : undefined,
        });
    }
};
exports.default = getMainCompanyList;
//# sourceMappingURL=service.js.map