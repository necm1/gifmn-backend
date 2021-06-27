import {HttpException} from '@nestjs/common';

/**
 * @class CategoryNotFoundException
 * @extends HttpException
 */
export class CategoryNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, 404);
  }
}
