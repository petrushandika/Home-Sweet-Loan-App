import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    const error =
      typeof exceptionResponse === 'string'
        ? { message: exceptionResponse }
        : (exceptionResponse as any);

    const message = error.message || error.error || 'Unexpected error occurred';
    
    // Log internal errors
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
       this.logger.error(
         `Error processing request ${request.method} ${request.url}`,
         exception instanceof Error ? exception.stack : String(exception),
       );
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message[0] : message, // If validation error array, take first
      timestamp: new Date().toISOString(),
      path: request.url,
      // Include original validation errors if available
      ...(Array.isArray(message) && { errors: message }),
      data: null,
    });
  }
}
