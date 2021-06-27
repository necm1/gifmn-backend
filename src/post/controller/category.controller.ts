import {Controller, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {PostCategory} from '../entity/post-category.entity';
import {CategoryService} from '../service/category.service';
import {ResponseService} from '../../_service/response.service';
import {APIResponse} from '../../_model/api-response.model';
import {AuthGuard} from '@nestjs/passport';

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
   */
  constructor(
    private categoryService: CategoryService,
    private responseService: ResponseService
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

  @UseGuards(AuthGuard('jwt'))
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
}
