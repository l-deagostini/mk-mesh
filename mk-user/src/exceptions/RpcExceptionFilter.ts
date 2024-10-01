import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

@Catch()
export class RcpExceptionFilter implements ExceptionFilter {
    private logger = new Logger(RcpExceptionFilter.name);
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        this.logger.error(`Caught exception: ${host.getType()}/${exception.message}`);
        if (exception?.response?.statusCode) {
            response.status(exception.response.statusCode).json({
                statusCode: exception.response.statusCode,
                message: exception.response.message,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        } else if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const errorResponse = exception.getResponse();
            response.status(status).json({
                statusCode: status,
                message: errorResponse,
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        } else {
            response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: 'Internal server error',
                timestamp: new Date().toISOString(),
                path: request.url,
            });
        }
    }
}