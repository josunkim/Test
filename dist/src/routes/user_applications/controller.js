"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const testUserMiddleware_1 = __importDefault(require("../middleware/testUserMiddleware"));
const getApplicationList_1 = __importDefault(require("./getApplicationList"));
const router = express_1.default.Router();
// 지원서 관련 엔드포인트
router.get("/", testUserMiddleware_1.default, getApplicationList_1.default); // 지원서 목록 조회
// router.post("/", service.getBookmarks); // 지원서 생성
// router.patch("/:id", service.getBookmarks); // 지원서 수정
// router.delete("/:id", service.getBookmarks); // 지원서 삭제
exports.default = router;
//# sourceMappingURL=controller.js.map