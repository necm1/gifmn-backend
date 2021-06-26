import {Controller, Get} from '@nestjs/common';
import {PostService} from '../service/post.service';
import {Paginate, Paginated, PaginateQuery} from 'nestjs-paginate';
import {Post} from '../entity/post.entity';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostService) {
  }

  @Get()
  /**
   * Get List of Posts
   *
   * @public
   * @async
   * @param query
   * @returns Promise<Paginated<Post>>
   */
  public async posts(@Paginate() query: PaginateQuery): Promise<Paginated<Post>> {
    return this.postService.paginatePosts(query);
  }
}
