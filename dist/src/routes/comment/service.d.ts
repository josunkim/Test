import { Request, Response } from "express";
declare const commentService: {
    getCompaniesCommentList: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getCompaniesCommentListById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createCompaniesComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateCompaniesComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteCompaniesComment: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
export default commentService;
