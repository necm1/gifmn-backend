import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {Post} from '../entity/post.entity';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
import {PostRepository} from '../repository/post.repository';

@Injectable()
export class PostService {
  constructor(
    private postRepository: PostRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager
  ) {
    this.postRepository.setProvider(cacheManager);
  }

  findAll(): Promise<Post[]> {
    return this.postRepository.find({relations: ['user', 'tags', 'attachments']});
  }

  /**
   * @public
   * @param id
   * @param options
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
    })
  }

  /**
   * Paginate Posts
   *
   * @public
   * @param options
   * @returns Promise<Paginated<Post>>
   */
 /* public async paginatePosts(options: IPaginationOptions): Promise<Pagination<Post>> {
    return paginate<Post>(this.postRepository, options);
  }*/
}
