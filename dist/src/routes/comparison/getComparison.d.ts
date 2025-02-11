import { Request, Response } from "express";
declare const ComparisonList: {
    getCompanyApplication: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    getSearchCompany: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
};
export default ComparisonList;
