import {CACHE_MANAGER, HttpException, Inject, Injectable} from '@nestjs/common';
import {Post} from '../entity/post.entity';
import {IPaginationOptions, Pagination} from 'nestjs-typeorm-paginate';
import {PostRepository} from '../repository/post.repository';
import {TagNotFoundException} from '../exception/tag-not-found.exception';
import {PostTag} from '../entity/post-tag.entity';
import {TagNotReplaceableException} from '../exception/tag-not-replaceable.exception';

@Injectable()
/**
 * @class PostService
 */
export class PostService {
  /**
   * PostService Constructor
   *
   * @constructor
   * @param postRepository
   * @param attachmentService
   * @param cacheManager
   */
  constructor(
    private postRepository: PostRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager
  ) {
    this.postRepository.setProvider(cacheManager);
  }

  /**
   * Get Post
   *
   * @public
   * @async
   * @param id
   * @param force
   * @returns Promise<Post>
   */
  public async get(id: number, force?: boolean): Promise<Post> {
    const post: Post = await this.postRepository.findOne({id}, {force});

    if (!post) {
      //@todo create PostNotFoundException
      throw new TagNotFoundException(id);
    }

    return post;
  }

  /**
   * Create Post
   *
   * @public
   * @async
   * @param post
   * @returns Promise<Post>
   */
  public async create(post: any): Promise<Post> {
    return this.postRepository.save(post);
  }

  /**
   * Update Post
   *
   * @public
   * @async
   * @param post
   * @param id
   * @returns Promise<void>
   */
  public async update(post: Post, id?: number): Promise<void> {
    if (id && post.id) {
      delete post.id;
    }

    if (post.title?.length < 3) {
      throw new HttpException('Minimum length of name is 3', 400);
    }

    const entity = await this.postRepository.update(id ?? post.id, post);

    if (!entity || entity.affected === 0) {
      throw new TagNotReplaceableException(post.id);
    }
  }

  /**
   * @public
   * @async
   * @param id
   * @param force
   * @param options
   * @returns Promise<Pagination<Post>>
   */
  public async paginateCategoryPosts(id: number, force = false,options: IPaginationOptions): Promise<Pagination<Post>> {
    return this.postRepository.list(options, force, {
      where: {
        category: {
          id
        }
      },
      order: {
        id: 'DESC'
      }
    });
  }

  /**
   * @public
   * @param id
   * @returns Promise<boolean>
   */
  public async delete(id: number): Promise<boolean> {
    return (await this.postRepository.delete(id)).affected !== 0;
  }
}
