import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {Post} from '../entity/post.entity';
import {IPaginationOptions, Pagination} from 'nestjs-typeorm-paginate';
import {PostRepository} from '../repository/post.repository';

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
   * @public
   * @async
   * @param id
   * @param options
   * @returns Promise<Pagination<Post>>
   */
  public async paginateCategoryPosts(id: number, options: IPaginationOptions): Promise<Pagination<Post>> {
    return this.postRepository.list(options, {
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
