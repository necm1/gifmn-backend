import {EntityRepository} from 'typeorm';
import {PostTag} from '../entity/post-tag.entity';
import {Repository} from '../../_helper/repository/helper';

@EntityRepository(PostTag)
export class TagRepository extends Repository<PostTag> {
  /**
   * @public
   * @property
   */
  public readonly cachePrefix = 'GIFMN_TAG_';

  /**
   * @public
   * @property
   */
  public readonly cacheCollectionPrefix = 'GIFMN_TAG_COLLECTION_';
}
