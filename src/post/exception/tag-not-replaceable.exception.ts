import {HttpException} from '@nestjs/common';

/**
 * @class TagNotReplaceableException
 * @extends HttpException
 */
export class TagNotReplaceableException extends HttpException {
  constructor(id: number) {
    super(`Could not update Tag with ID "${id}"`, 500);
  }
}
