import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let errorResponse: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
    };

    // Handle validation errors
    if (status === HttpStatus.BAD_REQUEST && typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as Record<string, any>;
      if ('message' in responseObj && Array.isArray(responseObj.message)) {
        errorResponse.message = 'Validation failed';
        errorResponse.errors = responseObj.message;
      } else if ('message' in responseObj && 'errors' in responseObj) {
        errorResponse.message = responseObj.message;
        errorResponse.errors = responseObj.errors;
      } else {
        errorResponse.message = responseObj.message || 'Bad Request';
      }
    } else {
      errorResponse.message = exception.message;
    }

    response
      .status(status)
      .json(errorResponse);
  }
} 