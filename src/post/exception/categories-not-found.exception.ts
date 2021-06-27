import {HttpException} from '@nestjs/common';

/**
 * @class CategoriesNotFoundException
 * @extends HttpException
 */
export class CategoriesNotFoundException extends HttpException {
  constructor() {
    super('No items were found', 404);
  }
}
