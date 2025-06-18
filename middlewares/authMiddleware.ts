import { NextFunction, Request,Response } from "express";
import HttpException from "../exception/httpException";
import jwt from 'jsonwebtoken'
import { CustomJwtPayload } from "../dto/jwt-payload";
import "dotenv/config";

const getToken = (req: Request): string => {
    const token = req.headers.authorization;
    if (!token)
        throw new HttpException(401, "not authorized");
    const tokenSplits = token.split(' ');
    if (tokenSplits.length != 2)
        throw new HttpException(401, "Invalid token")
    return tokenSplits[1]
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = getToken(req)
    if (!token)
        throw new HttpException(401, "Not authorized")
    try{
        const payload=jwt.verify(token,process.env.JWT_SECRET as string) as CustomJwtPayload
        req.user=payload;
        console.log(payload);
    }catch{
        throw new HttpException(401,"Invalid or expired token")
    }
    next();
}
