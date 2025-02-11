import { prisma } from "../../prismaClient";
import { Request, Response } from "express";

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: Operations related to bookmarks
 */

/**
 * @swagger
 * /api/bookmarks/{userId}:
 *   get:
 *     summary: 유저의 즐겨찾기 리스트
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The user ID for fetching bookmarks
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of bookmarks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   companyId:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: No bookmarks found for the user
 *       500:
 *         description: Internal server error
 */
// 📝북마크 목록 조회
const getBookmarks = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    // 1. 사용자의 즐겨찾기 목록 조회
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: userId,
        deletedAt: null, // 삭제되지 않은 즐겨찾기만 조회
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (bookmarks.length === 0) {
      return res
        .status(404)
        .json({ message: "해당 사용자의 즐겨찾기가 없습니다." });
    }
    res.status(200).json(bookmarks);
  } catch (err) {
    console.error("Error message in getBookmarks", err);
    res.status(500).json({ message: "즐겨찾기 조회 실패" });
  }
};

/**
 * @swagger
 * /api/bookmarks/{userId}:
 *   post:
 *     summary: bookmark 생성
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The user ID for adding a new bookmark
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: The ID of the company to be bookmarked
 *                 example: "12345"
 *     responses:
 *       201:
 *         description: The bookmark was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 companyId:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Bookmark already exists for this company
 *       500:
 *         description: Internal server error
 */
// 📝북마크 생성
const createBookmark = async (req: Request, res: Response) => {
  const { userId } = req.params; // URL의 userId 파라미터 받기
  const { companyId } = req.body; // 요청 본문에서 companyId 받기
  try {
    // 1. 유효성 검증: 사용자가 이미 해당 회사에 대해 즐겨찾기를 추가했는지 확인
    const existingBookmark = await prisma.bookmark.findFirst({
      where: {
        userId: userId,
        companyId: companyId,
        deletedAt: null, // 삭제되지 않은 즐겨찾기만 조회
      },
    });
    // 이미 즐겨찾기로 존재하는 경우
    if (existingBookmark) {
      return res
        .status(400)
        .json({ message: "이 기업은 이미 즐겨찾기로 등록되어 있습니다." });
    }
    // 2. 즐겨찾기 추가
    const newBookmark = await prisma.bookmark.create({
      data: {
        userId,
        companyId,
      },
    });
    res.status(201).json(newBookmark); // 생성된 북마크 반환
  } catch (err) {
    console.error("Error message in createBookmark", err);
    res.status(500).json({ message: "즐겨찾기 추가 실패" });
  }
};

/**
 * @swagger
 * /api/bookmarks/{userId}:
 *   delete:
 *     summary: 즐겨찾기 삭제
 *     tags: [Bookmarks]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The user ID for deleting a bookmark
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId:
 *                 type: string
 *                 description: The ID of the company to be removed from bookmarks
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Bookmark successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 companyId:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 deletedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Bookmark not found
 *       500:
 *         description: Internal server error
 */
// 📝북마크 삭제
const deleteBookmark = async (req: Request, res: Response) => {
  const { userId } = req.params; // URL의 userId 파라미터 받기
  const { companyId } = req.body; // 요청 본문에서 companyId 받기
  try {
    const bookmark = await prisma.bookmark.findFirst({
      where: {
        userId: userId,
        companyId: companyId,
        deletedAt: null, // 삭제되지 않은 즐겨찾기만 조회
      },
    });
    if (!bookmark) {
      return res
        .status(404)
        .json({ message: "해당 즐겨찾기를 찾을 수 없습니다." });
    }
    //삭제날짜
    const deletedBookmark = await prisma.bookmark.update({
      where: {
        id: bookmark.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
    res.status(200).json(deletedBookmark);
  } catch (err) {
    console.error("Error message in deleteBookmark", err);
    res.status(500).json({ message: "즐겨찾기 삭제 실패" });
  }
};

const bookmarkService = {
  getBookmarks,
  createBookmark,
  deleteBookmark,
};

export default bookmarkService;
