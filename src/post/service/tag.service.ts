import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from '../../_helper/repository/helper';
import {PostTag} from '../entity/post-tag.entity';
import {CacheService} from '../../cache/service/cache.service';
import {TagIdDeleteFailedException} from '../exception/tag-id-delete-failed.exception';
import {TagRepository} from '../repository/tag.repository';

@Injectable()
/**
 * @class TagService
 */
export class TagService {
  /**
   * TagService Constructor
   *
   * @constructor
   * @param tagRepository
   * @param cacheManager
   */
  constructor(
    private tagRepository: TagRepository,
    @Inject(CACHE_MANAGER) private cacheManager
  ) {
    this.tagRepository.setProvider(cacheManager.store);
  }

  /**
   * Delete Tag By ID
   *
   * @public
   * @param id
   * @returns Promise<boolean>
   */
  public async delete(id: number): Promise<boolean> {
    const result = await this.tagRepository.delete({id});

    if (!result.affected || result.affected === 0) {
      throw new TagIdDeleteFailedException(id);
    }

    return true;
  }
}
