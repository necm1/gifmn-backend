import {HttpException} from '@nestjs/common';

/**
 * @class AttachmentUrlNotFoundException
 * @extends HttpException
 */
export class AttachmentUrlNotFoundException extends HttpException {
  constructor(message: string) {
    super(message, 404);
  }
}
