"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = __importDefault(require("./service"));
const router = express_1.default.Router();
// 코멘트 관련 엔드포인트
router.get("/", service_1.default.getCompaniesCommentList); // 코멘트 목록 조회
router.get("/:id", service_1.default.getCompaniesCommentListById); // 코멘트 목록 조회 by ID
router.post("/", service_1.default.createCompaniesComment); //코멘트 생성
router.patch("/:id", service_1.default.updateCompaniesComment); // 코멘트 수정
router.delete("/:id", service_1.default.deleteCompaniesComment); // 코멘트 삭제
exports.default = router;
//# sourceMappingURL=controller.js.map