import {Controller, DefaultValuePipe, Get, Param, ParseIntPipe, Query} from '@nestjs/common';
import {PostCategory} from '../entity/post-category.entity';
import {CategoryService} from '../service/category.service';
import {ResponseService} from '../../_service/response.service';
import {APIResponse} from '../../_model/api-response.model';
import {Pagination} from 'nestjs-typeorm-paginate';
import {Post} from '../entity/post.entity';
import {PostService} from '../service/post.service';

@Controller()
/**
 * @class CategoryController
 */
export class CategoryController {

  /**
   * CategoryController Constructor
   *
   * @constructor
   * @param categoryService
   * @param responseService
   * @param postService
   */
  constructor(
    private categoryService: CategoryService,
    private responseService: ResponseService,
    private postService: PostService
  ) {
  }

  @Get('categories')
  /**
   * Get All Categories
   *
   * @public
   * @async
   * @returns Promise<APIResponse<PostCategory[]>>
   */
  public async categories(): Promise<APIResponse<PostCategory[]>> {
    return this.responseService.build<PostCategory[]>(await this.categoryService.all());
  }

  @Get('category/:id')
  /**
   * Get Category
   *
   * @public
   * @async
   * @param id
   * @returns Promise<APIResponse<PostCategory>>
   */
  public async get(@Param('id', new ParseIntPipe()) id): Promise<APIResponse<PostCategory>> {
    return this.responseService.build<PostCategory>(await this.categoryService.get(id));
  }

  @Get('category/:id/posts')
  /**
   * Get List of Posts
   *
   * @public
   * @async
   * @param query
   * @returns Promise<Paginated<Post>>
   */
  public async posts(
    @Param('id', new ParseIntPipe()) id: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
  ): Promise<Pagination<Post>> {
    limit = limit > 100 ? 100 : limit;

    await this.categoryService.get(id);

    return this.postService.paginateCategoryPosts(id, {
      page,
      limit,
      route: `http://127.0.0.1:1337/category/${id}/posts`,
    })
  }
}
