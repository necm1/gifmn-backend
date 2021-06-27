import {Injectable} from '@nestjs/common';
import {APIResponse} from '../_model/api-response.model';

@Injectable()
/**
 * @class Response
 */
export class ResponseService {
  /**
   * Build Response Object
   *
   * @public
   * @param data
   * @param status
   * @param errors
   * @returns Promise<APIResponse<T>>
   */
  public async build<T>(data: T, status = 201, errors?: string | []): Promise<APIResponse<T>> {
    if (status > 400 && status < 599) {
      if (typeof errors === 'string') {
        return {status, error: errors};
      }

      return {status, errors};
    }

    return {status, data};
  }
}
