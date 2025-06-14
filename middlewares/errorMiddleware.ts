import { Request, Response, NextFunction } from "express";
import HttpException from "../exception/httpException";
import { LoggerService } from "../services/logger.service";

const logger=LoggerService.getInstance("errorMiddleware");

const errorMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (error instanceof HttpException) {
      const status: number = error.status || 500;
      const message: string = error.message || "Something went wrong";
      let resBody = { message: message };
      res.status(status).json(resBody);
      logger.error(`\nError Status:${error.status}\t Error Message:${error.message}`);
    } else {
      logger.error(error.stack);
      res.status(500).send({ error: error.message });
    }
  } catch (err) {
    next(error);
  }
};

export default errorMiddleware;
