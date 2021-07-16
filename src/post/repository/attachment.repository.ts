import {EntityRepository} from 'typeorm';
import {Repository} from '../../_helper/repository/helper';
import {PostAttachment} from '../entity/post-attachment.entity';

@EntityRepository(PostAttachment)
export class AttachmentRepository extends Repository<PostAttachment> {
  /**
   * @public
   * @property
   */
  public readonly cachePrefix = 'GIFMN_ATTACHMENT_';

  /**
   * @public
   * @property
   */
  public readonly cacheCollectionPrefix = 'GIFMN_ATTACHMENT_COLLECTION_';
}
