import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class RequestMiddleware implements NestMiddleware{
    private logger = new Logger(RequestMiddleware.name);
    use(req: Request, res: Response, next: NextFunction) {
        this.logger.log(`[${req.ip}][${req.method} ${req.originalUrl}]`);
        next();
    }
}