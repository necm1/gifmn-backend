import {EntityRepository} from 'typeorm';
import {Repository} from '../../_helper/repository/helper';
import {PostCategory} from '../entity/post-category.entity';

@EntityRepository(PostCategory)
export class CategoryRepository extends Repository<PostCategory> {
  /**
   * @public
   * @property
   */
  public readonly cachePrefix = 'GIFMN_CATEGORY_';

  /**
   * @public
   * @property
   */
  public readonly cacheCollectionPrefix = 'GIFMN_CATEGORY_COLLECTION_';
}
