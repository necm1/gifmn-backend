import {HttpException} from '@nestjs/common';

/**
 * @class WrongImageTypeException
 * @extends HttpException
 */
export class WrongImageTypeException extends HttpException {
  /**
   * WrongImageTypeException Constructor
   *
   * @constructor
   * @param type
   */
  constructor(type: string) {
    super(`Could not upload image with type "${type}"`, 400);
  }
}
