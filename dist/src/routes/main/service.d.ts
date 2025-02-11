import { Request, Response } from "express";
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
    page?: string;
    filter?: string;
    search?: string;
}
interface CompanyDTO {
    id: string;
    idx: string;
    name: string;
    image?: string;
    content: string;
    category: {
        id: string;
        category: string;
    }[];
    salesRevenue: string;
    employeeCnt: number;
    applicantCnt: number;
    createdAt: string;
    updatedAt: string;
}
interface CompanyListResponse {
    companies: CompanyDTO[];
    page: number;
    totalPages: number;
}
interface ErrorResponse {
    message: string;
    error?: string;
    stack?: string;
}
/**
 * 메인 페이지에 표시될 회사 목록을 조회하는 함수
 * @param req - Express Request 객체
 * @param res - Express Response 객체
 * @returns 회사 목록 또는 에러 응답
 */
declare const getMainCompanyList: (req: Request<{}, {}, {}, QueryType>, res: Response<CompanyListResponse | ErrorResponse>) => Promise<Response<CompanyListResponse | ErrorResponse, Record<string, any>>>;
export default getMainCompanyList;
