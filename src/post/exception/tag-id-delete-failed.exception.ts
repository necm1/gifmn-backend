import {HttpException} from '@nestjs/common';

/**
 * @class CategoryNotFoundException
 * @extends HttpException
 */
export class TagIdDeleteFailedException extends HttpException {
  constructor(id: number) {
    super(`Could not delete Tag with ID "${id}"`, 500);
  }
}
