import {HttpException} from '@nestjs/common';

/**
 * @class WrongTypeException
 * @extends HttpException
 */
export class WrongTypeException extends HttpException {
  /**
   * WrongImageTypeException Constructor
   *
   * @constructor
   * @param type
   */
  constructor(type: string) {
    super(`Could not upload with type "${type}"`, 400);
  }
}
