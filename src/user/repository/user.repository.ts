import {User} from '../entity/user.entity';
import {EntityRepository} from 'typeorm';
import {Repository} from '../../_helper/repository/helper';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /**
   * @public
   * @property
   */
  public readonly cachePrefix = 'GIFMN_USER_';

  /**
   * @public
   * @property
   */
  public readonly cacheCollectionPrefix = 'GIFMN_USER_COLLECTION_';
}
