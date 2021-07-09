import {HttpException} from '@nestjs/common';

/**
 * @class TagNotFoundException
 * @extends HttpException
 */
export class TagNotFoundException extends HttpException {
  constructor(id: number) {
    super(`Could not find Tag with ID: ${id}`, 404);
  }
}
