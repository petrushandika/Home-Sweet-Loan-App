import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    switch (exception.code) {
      case 'P2002': {
        const status = HttpStatus.CONFLICT;
        const target = (exception.meta?.target as string[])?.join(', ') || 'field';
        response.status(status).json({
          success: false,
          statusCode: status,
          message: `Unique constraint failed on ${target}`,
          timestamp: new Date().toISOString(),
        });
        break;
      }
      case 'P2025': {
        const status = HttpStatus.NOT_FOUND;
        response.status(status).json({
          success: false,
          statusCode: status,
          message: exception.message || 'Record not found',
          timestamp: new Date().toISOString(),
        });
        break;
      }
      default:
        // default 500
        super.catch(exception, host);
        break;
    }
  }
}
