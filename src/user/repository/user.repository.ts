import {User} from '../entity/user.entity';
import {EntityRepository, Repository} from 'typeorm';

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
