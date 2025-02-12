"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const path_1 = __importDefault(require("path"));
const isProd = process.env.NODE_ENV === "production"; // 환경 변수 확인
const SERVER_URL = isProd
  ? process.env.PROD_SERVER_URL // 배포 환경
  : process.env.DEV_SERVER_URL; // 개발 환경
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API 문서",
      version: "1.0.0",
      description: "사용자 및 기타 기능을 포함한 API 문서",
    },
    servers: [
      {
        url: SERVER_URL,
        description: isProd ? "배포 서버" : "개발 서버",
      },
    ],
    tags: [
      {
        name: "Users",
        description: "사용자 관련 API",
      },
      {
        name: "Applications",
        description: "사용자 지원 현황 관련 API",
      },
      {
        name: "Bookmarks",
        description: "즐겨찾기 관련 API",
      },
      {
        name: "Company",
        description: "스타트업 관련 API",
      },
      {
        name: "Comment",
        description: "댓글 관련 API",
      },
      {
        name: "Main",
        description: "",
      },
      {
        name: "Comparison",
        description: "",
      },
    ],
  },
  apis: [path_1.default.resolve(__dirname, "../dist/src/routes/**/*.js")],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
function setupSwagger(app) {
  app.use(
    "/api-docs",
    swagger_ui_express_1.default.serve,
    swagger_ui_express_1.default.setup(swaggerSpec)
  );
  // ✅ Swagger JSON 확인용 API 추가 (디버깅용)
  app.get("/swagger-spec", (req, res) => {
    res.json(swaggerSpec);
  });
}
module.exports = { setupSwagger, swaggerSpec };
//# sourceMappingURL=swagger.js.map
