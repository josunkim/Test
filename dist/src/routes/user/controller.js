"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = __importDefault(require("./service"));
const router = express_1.default.Router();
// 사용자 관련 엔드포인트
router.get("/", service_1.default.getuserList); // 사용자 목록 가져오기
router.get("/profile/:id", service_1.default.getUser); // 프로필 조회
router.post("/login", service_1.default.loginUser); // 로그인
router.post("/register", service_1.default.createUser); // 사용자 등록
router.patch("/profile/:id", service_1.default.updateUser); // 프로필 수정
router.delete("/:id", service_1.default.deleteUser); // 사용자 삭제
exports.default = router;
//# sourceMappingURL=controller.js.map