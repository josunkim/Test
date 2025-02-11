import { Request, Response } from "express";
declare const service: {
    getuserList: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    loginUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    updateUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    deleteUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
export default service;
