"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_1 = __importDefault(require("./service"));
const router = express_1.default.Router();
// 회사 관련 엔드포인트
router.get("/", service_1.default.getCompanies); // 회사 목록 조회
router.get("/:id", service_1.default.getCompany); // 회사 상세 조회
router.post("/", service_1.default.createCompany); // 회사 생성
router.patch("/:id", service_1.default.updateCompany); // 회사 정보 수정
router.delete("/:id", service_1.default.deleteCompany); // 회사 삭제
exports.default = router;
//# sourceMappingURL=controller.js.map