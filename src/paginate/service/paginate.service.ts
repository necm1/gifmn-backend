import {Injectable} from '@nestjs/common';
import {PaginateResponse} from '../model/paginate-response.model';

@Injectable()
/**
 * @class PaginateService
 */
export class PaginateService {
  public async paginate<T>(): Promise<PaginateResponse<T>> {
    return new PaginateResponse<T>();
  }
}
