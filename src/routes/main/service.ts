import { Request, Response } from "express";
import { prisma } from "../../prismaClient";
import { Prisma } from "@prisma/client";

/**
 * @swagger
 * /api/main/companies:
 *   get:
 *     tags:
 *       - Main
 *     summary: 메인 페이지 회사 목록 조회
 *     description: 회사 목록을 조회하며, 검색, 정렬, 페이지네이션 기능을 제공합니다.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 페이지 번호 (기본값: 1)
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *           enum: [revenueDesc, revenueAsc, employeeDesc, employeeAsc]
 *         description: 정렬 기준 (매출액/직원수 기준 오름차순/내림차순)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: 검색어 (회사명, 소개, 카테고리)
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 companies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Company'
 *                 page:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * components:
 *   schemas:
 *     Company:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         image:
 *           type: string
 *         content:
 *           type: string
 *         category:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               category:
 *                 type: string
 *         salesRevenue:
 *           type: string
 *         employeeCnt:
 *           type: integer
 *         applicantCnt:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

interface QueryType {
  page?: string; // 페이지 번호 (기본값: 1)
  filter?: string; // 정렬 기준 (revenueDesc: 매출액 높은순, revenueAsc: 매출액 낮은순, employeeDesc: 고용인원 많은순, employeeAsc: 고용인원 적은순)
  search?: string; // 검색어 (회사명, 회사 소개, 카테고리 검색)
}

interface CompanyDTO {
  id: string; // 회사 고유 ID
  idx: string; // 회사 인덱스 번호
  name: string; // 회사명
  image?: string; // 회사 로고 이미지 URL
  content: string; // 회사 소개글
  category: {
    // 회사 카테고리 정보
    id: string; // 카테고리 ID
    category: string; // 카테고리명
  }[];
  salesRevenue: string; // 매출액 (BigInt를 문자열로 변환)
  employeeCnt: number; // 직원 수
  applicantCnt: number; // 지원자 수
  createdAt: string; // 생성일시
  updatedAt: string; // 수정일시
}

interface CompanyListResponse {
  companies: CompanyDTO[]; // 회사 목록
  page: number; // 현재 페이지 번호
  totalPages: number; // 전체 페이지 수
}

interface ErrorResponse {
  message: string; // 에러 메시지
  error?: string; // 에러 상세 메시지 (선택적)
  stack?: string; // 스택 트레이스 (선택적)
}

/**
 * 메인 페이지에 표시될 회사 목록을 조회하는 함수
 * @param req - Express Request 객체
 * @param res - Express Response 객체
 * @returns 회사 목록 또는 에러 응답
 */
const getMainCompanyList = async (
  req: Request<{}, {}, {}, QueryType>,
  res: Response<CompanyListResponse | ErrorResponse>
) => {
  try {
    // 기본 파라미터 설정
    const page: number = Number(req.query.page) || 1;
    const limit: number = 10;
    const skip: number = (page - 1) * limit;
    const filter: string = req.query.filter || "revenueDesc";
    const search: string = req.query.search || "";

    // 기본 where 조건
    let whereCondition: any = {
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
    const orderBy: Prisma.CompaniesOrderByWithRelationInput =
      filter === "revenueDesc"
        ? { salesRevenue: Prisma.SortOrder.desc }
        : filter === "revenueAsc"
        ? { salesRevenue: Prisma.SortOrder.asc }
        : filter === "employeeDesc"
        ? { employeeCnt: Prisma.SortOrder.desc }
        : filter === "employeeAsc"
        ? { employeeCnt: Prisma.SortOrder.asc }
        : { salesRevenue: Prisma.SortOrder.desc };

    // 회사 목록 조회
    const companies = await prisma.companies.findMany({
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
    const applicantCounts = await prisma.userApplications.groupBy({
      by: ["companyId"],
      where: { companyId: { in: companies.map((c) => c.id) } },
      _count: { companyId: true },
    });

    const applicantCountMap = Object.fromEntries(
      applicantCounts.map((app) => [app.companyId, app._count.companyId])
    );

    // 응답 데이터 구성
    const totalCompanies = await prisma.companies.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(totalCompanies / limit);

    const response: CompanyListResponse = {
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
  } catch (e) {
    console.error("Error in getMainCompanyList:", e);
    return res.status(500).json({
      message: "서버 에러가 발생했습니다.",
      error: process.env.NODE_ENV === "development" ? e.message : undefined,
    });
  }
};

export default getMainCompanyList;
