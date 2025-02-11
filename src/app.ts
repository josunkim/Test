import express from "express";
import cors from "cors";
import userRoutes from "./routes/user/controller";
import companyRoutes from "./routes/company/controller";
import bookmarkRoutes from "./routes/bookmark/controller";
import categoryRoutes from "./routes/category/controller";
import commentRoutes from "./routes/comment/controller";
import userApplicationRoutes from "./routes/user_applications/controller";
import comparisonRoutes from "./routes/comparison/controller";
import mainRoutes from "./routes/main/controller";
import { setupSwagger } from "./swagger";

const app = express();

setupSwagger(app);
app.get("/swagger-spec", (req, res) => {
  res.json(require("./swagger").swaggerSpec);
});

//TODO: 프론트 배포 후에 cors 주소 추가하기
// 기본 미들웨어
app.use(cors());
app.use(express.json());
// 기본 라우트 구조
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/applications", userApplicationRoutes);
app.use("/api/comparison", comparisonRoutes);
app.use("/api/main", mainRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행중입니다`);
});

export default app;
