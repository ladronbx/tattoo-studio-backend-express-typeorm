import { NextFunction, Request, Response } from "express";
const admin = (req: Request, res: Response, next: NextFunction) => {
    
    if (req.token.role !== "admin") {
        return res.json({
            success: true,
            message: "You don't have permission to perform this action"
        })
    }
    next();
}
export { admin }