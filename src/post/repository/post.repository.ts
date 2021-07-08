import {EntityRepository} from 'typeorm';
import {Repository} from '../../_helper/repository/helper';
import {Post} from '../entity/post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {
  /**
   * @public
   * @property
   */
  public readonly cachePrefix = 'GIFMN_POST_';

  /**
   * @public
   * @property
   */
  public readonly cacheCollectionPrefix = 'GIFMN_POST_COLLECTION_';
}
