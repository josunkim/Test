import { Request, Response } from "express";
declare const companyService: {
    getCompanies: (req: Request, res: Response) => Promise<void>;
    getCompany: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    createCompany: (req: Request, res: Response) => Promise<void>;
    updateCompany: (req: Request, res: Response) => Promise<void>;
    deleteCompany: (req: Request, res: Response) => Promise<void>;
};
export default companyService;
