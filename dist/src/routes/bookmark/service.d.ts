import { Request, Response } from "express";
declare const bookmarkService: {
    getBookmarks: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createBookmark: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteBookmark: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
export default bookmarkService;
