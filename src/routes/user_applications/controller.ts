import express from "express";
import testUserMiddleware from "../middleware/testUserMiddleware";
import getApplicationList from "./getApplicationList";

const router = express.Router();

// 지원서 관련 엔드포인트
router.get("/", testUserMiddleware, getApplicationList); // 지원서 목록 조회
// router.post("/", service.getBookmarks); // 지원서 생성
// router.patch("/:id", service.getBookmarks); // 지원서 수정
// router.delete("/:id", service.getBookmarks); // 지원서 삭제

export default router;
