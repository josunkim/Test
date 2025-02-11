"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const controller_1 = __importDefault(require("./routes/user/controller"));
const controller_2 = __importDefault(require("./routes/company/controller"));
const controller_3 = __importDefault(require("./routes/bookmark/controller"));
const controller_4 = __importDefault(require("./routes/category/controller"));
const controller_5 = __importDefault(require("./routes/comment/controller"));
const controller_6 = __importDefault(require("./routes/user_applications/controller"));
const controller_7 = __importDefault(require("./routes/comparison/controller"));
const controller_8 = __importDefault(require("./routes/main/controller"));
const swagger_1 = require("./swagger");
const app = (0, express_1.default)();
(0, swagger_1.setupSwagger)(app);
//TODO: 프론트 배포 후에 cors 주소 추가하기
// 기본 미들웨어
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 기본 라우트 구조
app.use("/api/users", controller_1.default);
app.use("/api/companies", controller_2.default);
app.use("/api/bookmarks", controller_3.default);
app.use("/api/categories", controller_4.default);
app.use("/api/comments", controller_5.default);
app.use("/api/applications", controller_6.default);
app.use("/api/comparison", controller_7.default);
app.use("/api/main", controller_8.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행중입니다`);
});
exports.default = app;
//# sourceMappingURL=app.js.map