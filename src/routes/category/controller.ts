import express from "express";
import service from "./service";

const router = express.Router();

// 카테고리 관련 엔드포인트
router.get("/", service.getBookmarks); // 카테고리 목록 조회
router.post("/", service.getBookmarks); // 카테고리 생성
router.patch("/:id", service.getBookmarks); // 카테고리 수정
router.delete("/:id", service.getBookmarks); // 카테고리 삭제

export default router;
