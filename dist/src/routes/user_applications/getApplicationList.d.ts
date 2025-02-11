import { ApplicationStatus } from "@prisma/client";
import { Request, Response } from "express";
interface QueryType {
    page?: string;
    filter?: string;
}
interface ApplicationDTO {
    id?: string;
    name: string;
    image: string | null;
    content: string;
    category: {
        id: string;
        category: string;
    }[];
    status: ApplicationStatus | string;
    applicantCnt: number;
    createdAt?: Date;
    updatedAt?: Date;
}
interface ApplicationListResponse {
    applications: ApplicationDTO[];
    page: number;
    totalPages: number;
}
interface ErrorResponse {
    message: string;
}
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
declare const getApplicationList: (req: Request<{}, {}, {}, QueryType>, res: Response<ApplicationListResponse | ErrorResponse>) => Promise<Response<ApplicationListResponse | ErrorResponse, Record<string, any>>>;
export default getApplicationList;
