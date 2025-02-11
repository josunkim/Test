"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = __importDefault(require("./service"));
const router = express_1.default.Router();
// 카테고리 관련 엔드포인트
router.get("/", service_1.default.getBookmarks); // 카테고리 목록 조회
router.post("/", service_1.default.getBookmarks); // 카테고리 생성
router.patch("/:id", service_1.default.getBookmarks); // 카테고리 수정
router.delete("/:id", service_1.default.getBookmarks); // 카테고리 삭제
exports.default = router;
//# sourceMappingURL=controller.js.map