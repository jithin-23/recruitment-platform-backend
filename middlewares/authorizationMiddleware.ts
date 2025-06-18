import { NextFunction, Request, Response } from "express";
import { UserRole } from "../entities/person.entity";
import HttpException from "../exception/httpException";

export const createAuthorizationMiddleware = (...roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const role = req.user?.role;
        console.log(`Authorized roles: ${roles} present role: ${role}`)
        if (!roles.includes(role)) {
            throw new HttpException(403, "User has no privilege to access the resource")
        }
        next();
    }
}
