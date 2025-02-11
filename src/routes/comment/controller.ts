import express from "express";
import service from "./service";

const router = express.Router();

// 코멘트 관련 엔드포인트
router.get("/", service.getCompaniesCommentList); // 코멘트 목록 조회
router.get("/:id", service.getCompaniesCommentListById); // 코멘트 목록 조회 by ID
router.post("/", service.createCompaniesComment); //코멘트 생성
router.patch("/:id", service.updateCompaniesComment); // 코멘트 수정
router.delete("/:id", service.deleteCompaniesComment); // 코멘트 삭제

export default router;
