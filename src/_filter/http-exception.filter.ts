import {ExceptionFilter, Catch, ArgumentsHost, HttpException} from '@nestjs/common';
import {FastifyReply} from 'fastify';
import {APIResponse} from '../_model/api-response.model';
import {ExceptionResponse} from '../_model/exception-response.model';
import {environment} from '../environment';


@Catch(HttpException)
/**
 * @class HttpExceptionFilter
 * @implements ExceptionFilter
 */
export class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();
    const status = exception.getStatus();

    const body: APIResponse<ExceptionResponse> = {
      status,
      error: {
        name: exception.name,
        message: exception.message
      }
    };

    if (!environment.production) {
      body['error']['stack'] = exception.stack.split(' ').filter(value => value);
    }

    response
      .status(status)
      .send(body);
  }
}
