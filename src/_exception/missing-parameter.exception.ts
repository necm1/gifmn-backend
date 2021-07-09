import {HttpException} from '@nestjs/common';

/**
 * @class MissingParameterException
 * @extends HttpException
 */
export class MissingParameterException extends HttpException {
  constructor(param: any) {
    super(`Missing Parameter: ${param}`, 400);
  }
}
