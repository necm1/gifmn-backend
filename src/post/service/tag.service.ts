import {CACHE_MANAGER, HttpException, Inject, Injectable} from '@nestjs/common';
import {PostTag} from '../entity/post-tag.entity';
import {TagIdDeleteFailedException} from '../exception/tag-id-delete-failed.exception';
import {TagRepository} from '../repository/tag.repository';
import {TagNotReplaceableException} from '../exception/tag-not-replaceable.exception';
import {TagNotFoundException} from '../exception/tag-not-found.exception';
import {Post} from '../entity/post.entity';

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
    @Inject(CACHE_MANAGER)
    private cacheManager
  ) {
    this.tagRepository.setProvider(cacheManager);
  }

  /**
   * Get PostTag
   *
   * @public
   * @async
   * @param id
   * @returns Promise<PostTag>
   */
  public async get(id: number): Promise<PostTag> {
    const tag: PostTag = await this.tagRepository.findOne({id});

    if (!tag) {
      throw new TagNotFoundException(id);
    }

    return tag;
  }

  /**
   * @public
   * @async
   * @param tags
   * @param post
   * @returns Promise<PostTag[]>
   */
  public async create(tags: PostTag[], post: Post): Promise<PostTag[]> {
    const entries: PostTag[] = [];

    for (const tag of tags) {
      const entity = this.tagRepository.create();

      entity.name = tag.name;
      entity.post = post;

      await this.tagRepository.save(entity);
      entries.push(entity);
    }

    return entries;
  }

  /**
   * Update Tag
   *
   * @public
   * @async
   * @param tag
   * @param id
   * @returns Promise<void>
   */
  public async update(tag: PostTag, id?: number): Promise<void> {
    if (id && tag.id) {
      delete tag.id;
    }

    if (tag.name && tag.name.length < 3) {
      throw new HttpException('Minimum length of name is 3', 400);
    }

    const entity = await this.tagRepository.update(id ?? tag.id, tag);

    if (!entity || entity.affected === 0) {
      throw new TagNotReplaceableException(tag.id);
    }
  }

  /**
   * Delete Tag By ID
   *
   * @public
   * @async
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
