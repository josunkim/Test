import express from "express";
import service from "./service";

const router = express.Router();

// 사용자 관련 엔드포인트
router.get("/", service.getuserList); // 사용자 목록 가져오기
router.get("/profile/:id", service.getUser); // 프로필 조회
router.post("/login", service.loginUser); // 로그인
router.post("/register", service.createUser); // 사용자 등록
router.patch("/profile/:id", service.updateUser); // 프로필 수정
router.delete("/:id", service.deleteUser); // 사용자 삭제

export default router;
