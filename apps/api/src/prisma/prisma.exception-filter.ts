import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

import { Prisma } from './generated/client';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientInitializationError,
  Prisma.PrismaClientRustPanicError
)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong';

    if (exception instanceof Prisma.PrismaClientValidationError) {
      httpStatus = HttpStatus.BAD_REQUEST;
      message = 'Invalid data provided. Please check your input fields.';
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const errorCode = exception.code;

      switch (errorCode) {
        case 'P2000':
          httpStatus = HttpStatus.BAD_REQUEST;
          message = 'Input value is too long for the field';
          break;

        case 'P2002': {
          const target = exception.meta?.target as string[] | undefined;
          httpStatus = HttpStatus.CONFLICT;
          message = target
            ? `Record with the following fields already exists: ${target.join(', ')}`
            : 'Record with similar data already exists';
          break;
        }

        case 'P2003':
          httpStatus = HttpStatus.BAD_REQUEST;
          message = 'The operation references a record that does not exist.';
          break;

        case 'P2001':
        case 'P2025':
          httpStatus = HttpStatus.NOT_FOUND;
          message = 'Record not found';
          break;

        default:
          this.logger.error(
            `Unhandled Prisma Code: ${exception.code}`,
            exception.stack
          );
          httpStatus = HttpStatus.BAD_REQUEST;
          message = 'Could not perform database operation.';
          break;
      }
    } else {
      this.logger.error(
        'Critical Database Error',
        exception instanceof Error ? exception.stack : exception
      );
    }

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message: message,
    });
  }
}
