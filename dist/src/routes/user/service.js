"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("../../prismaClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
// 사용자 목록 가져오기
/**
 * @swagger
 * /api/applications:
 *   get:
 *     tags:
 *       - Applications
 *     summary: 지원 현황 조회
 *     description: 로그인한 사용자의 지원 내역을 조회합니다.
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         description: "조회할 페이지 번호 (기본값: 1)"
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: filter
 *         required: false
 *         description: "지원 상태 필터 (기본값: all)"
 *         schema:
 *           type: string
 *           enum: [all, PENDING, ACCEPTED, REJECTED]
 *     responses:
 *       200:
 *         description: 지원 현황 반환
 *       401:
 *         description: 인증 실패 (사용자를 찾을 수 없음)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "일치하는 userId가 없습니다."
 *       404:
 *         description: 지원 내역을 찾을 수 없음
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applications:
 *                   type: array
 *                   items:
 *                     type: object
 *                   example: []
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 0
 *       500:
 *         description: 서버 오류
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "서버 에러입니다."
 */
const getuserList = async (req, res) => {
  try {
    const users = await prismaClient_1.prisma.users.findMany({
      where: {
        deletedAt: null, // 소프트 삭제된 데이터 제외
      },
    });
    return res.status(200).json(users); // 사용자 목록을 JSON 형식으로 응답
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error });
  }
};
// 사용자 등록
/**
 * @swagger
 * /api/users/create:
 *   post:
 *     tags: [Users]
 *     summary: 사용자 등록
 *     description: 새로운 사용자를 등록합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: 이메일
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *               name:
 *                 type: string
 *                 description: 이름
 *               nickname:
 *                 type: string
 *                 description: 닉네임
 *     responses:
 *       201:
 *         description: 사용자 등록 성공
 *       500:
 *         description: 서버 오류
 */
const createUser = async (req, res) => {
  try {
    const { email, password, name, nickname } = req.body;
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = await prismaClient_1.prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        name,
        nickname,
      },
    });
    return res.status(201).json(newUser); // 새 사용자 등록 후 응답
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "서버 오류" });
  }
};
// 로그인 처리 (단순 예시, 실제로는 비밀번호 비교 및 JWT 등을 처리해야 함)
/**
 * @swagger
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: 사용자 로그인
 *     description: 이메일과 비밀번호로 로그인합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       400:
 *         description: 잘못된 이메일 또는 비밀번호
 *       500:
 *         description: 서버 오류
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prismaClient_1.prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "잘못된 이메일 또는 비밀번호" });
    }
    return res.status(200).json(user); // 로그인 성공 시 사용자 정보 응답
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "서버 오류" });
  }
};
// 사용자 프로필 조회
/**
 * @swagger
 * /api/users/profile/{id}:
 *   get:
 *     tags: [Users]
 *     summary: 사용자 프로필 조회
 *     description: ID를 기반으로 사용자 정보를 조회합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 사용자 정보 반환
 *       404:
 *         description: 사용자를 찾을 수 없음
 *       500:
 *         description: 서버 오류
 */
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prismaClient_1.prisma.users.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다" });
    }
    return res.status(200).json(user); // 사용자 프로필 정보 응답
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "서버 오류" });
  }
};
// 사용자 프로필 수정
/**
 * @swagger
 * /api/users/profile/{id}:
 *   patch:
 *     tags: [Users]
 *     summary: 사용자 프로필 수정
 *     description: 사용자 정보를 수정합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               nickname:
 *                 type: string
 *     responses:
 *       200:
 *         description: 사용자 정보 수정 성공
 *       500:
 *         description: 서버 오류
 */
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, name, nickname } = req.body;
    const updatedUser = await prismaClient_1.prisma.users.update({
      where: { id },
      data: {
        email,
        password,
        name,
        nickname,
      },
    });
    return res.status(200).json(updatedUser); // 업데이트된 사용자 프로필 응답
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "서버 오류" });
  }
};
// 사용자 삭제
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: 사용자 삭제
 *     description: ID를 기반으로 사용자를 삭제합니다.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 사용자 삭제 성공
 *       500:
 *         description: 서버 오류
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await prismaClient_1.prisma.users.delete({
      where: {
        id,
      },
    });
    return res.status(200).json({ message: "사용자 삭제 성공" }); // 사용자 삭제 성공 메시지
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "서버 오류" });
  }
};
const service = {
  getuserList,
  createUser,
  loginUser,
  getUser,
  updateUser,
  deleteUser,
};
exports.default = service;
//# sourceMappingURL=service.js.map
