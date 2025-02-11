import express from "express";
import getMainCompanyList from "./service";

const router = express.Router();

router.get("/companies", getMainCompanyList);

export default router;
