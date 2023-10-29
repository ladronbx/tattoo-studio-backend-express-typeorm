import { NextFunction, Request, Response } from "express";
const isSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
    
    if (req.token.role !== "super_admin") {
        return res.json({
            success: true,
            message: "You don't have permission to perform this action"
        })
    }
    next();
}
export { isSuperAdmin }