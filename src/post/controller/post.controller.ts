import {Controller, DefaultValuePipe, Get, ParseIntPipe, Query} from '@nestjs/common';
import {PostService} from '../service/post.service';
import {Post} from '../entity/post.entity';
import {Pagination} from 'nestjs-typeorm-paginate';

@Controller()
export class PostController {
  constructor(private postService: PostService) {
  }

  @Get('posts')
  /**
   * Get List of Posts
   *
   * @public
   * @async
   * @param query
   * @returns Promise<Paginated<Post>>
   */
  public async posts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Post>> {
    limit = limit > 100 ? 100 : limit;
    return this.postService.paginatePosts({
      page,
      limit,
      route: 'http://127.0.0.1:1337/posts',
    });
  }
}
