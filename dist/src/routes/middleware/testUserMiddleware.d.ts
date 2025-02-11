import { Request, Response, NextFunction } from "express";
declare const testUserMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export default testUserMiddleware;
