"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = __importDefault(require("./service"));
const router = express_1.default.Router();
// 북마크 관련 엔드포인트
router.get("/:userId", service_1.default.getBookmarks); // 북마크 목록 조회
router.post("/:userId", service_1.default.createBookmark); // 북마크 생성
router.delete("/:userId", service_1.default.deleteBookmark); // 북마크 삭제
exports.default = router;
//# sourceMappingURL=controller.js.map