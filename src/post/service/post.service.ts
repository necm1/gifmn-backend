import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {Post} from '../entity/post.entity';
import {IPaginationOptions, Pagination} from 'nestjs-typeorm-paginate';
import {PostRepository} from '../repository/post.repository';
import {TagNotFoundException} from '../exception/tag-not-found.exception';

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
}
