import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Put,
  Post as PostReq,
  Query, UseGuards
} from '@nestjs/common';
import {PostCategory} from '../entity/post-category.entity';
import {CategoryService} from '../service/category.service';
import {ResponseService} from '../../_service/response.service';
import {APIResponse} from '../../_model/api-response.model';
import {Pagination} from 'nestjs-typeorm-paginate';
import {Post} from '../entity/post.entity';
import {PostService} from '../service/post.service';
import {environment} from '../../environment';
import {TagService} from '../service/tag.service';
import {AttachmentService} from '../service/attachment.service';
import {UploadService} from '../service/upload.service';
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
   * @param postService
   * @param tagService
   * @param attachmentService
   * @param uploadService
   */
  constructor(
    private categoryService: CategoryService,
    private responseService: ResponseService,
    private postService: PostService,
    private tagService: TagService,
    private attachmentService: AttachmentService,
    private uploadService: UploadService
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

  /**
   * Delete Category
   *
   * @public
   * @async
   * @param id
   * @returns Promise<APIResponse<boolean>>
   */
  @Delete('category/:id')
  @UseGuards(AuthGuard('jwt'))
  public async delete(@Param('id') id: number): Promise<APIResponse<boolean>> {
    await this.categoryService.get(id);

    // Get Posts
    const posts: Post[] = await this.postService.getByCategory(id);

    if (posts.length > 0) {
      // Delete Posts
      for (const value of posts) {
        if (value.attachments.length > 0) {
          // Delete Attachments
          for (const attach of value.attachments) {
            await this.attachmentService.deleteByUrl(attach.url);

            // Delete Attachment File
            await this.uploadService.delete(attach.url, attach.type);
          }
        }

        if (value.tags.length > 0) {
          // Delete Tags
          for (const tag of value.tags) {
            await this.tagService.delete(tag.id);
          }
        }

        // Delete Post
        await this.postService.delete(value.id);
      }
    }

    return this.responseService.build<boolean>(await this.categoryService.delete(id));
  }

  /**
   * Update Category
   *
   * @public
   * @async
   * @param id
   * @param name
   * @returns Promise<APIResponse<PostCategory>>
   */
  @Put('category/:id')
  @UseGuards(AuthGuard('jwt'))
  public async update(@Param('id') id: number, @Body() body: {name: string}): Promise<APIResponse<PostCategory>> {
    await this.categoryService.get(id);

    if (!body || Object.keys(body).length === 0 || !body.name) {
      throw new HttpException('name need a value', 400);
    }

    if (body.name.length < 3) {
      throw new HttpException('name must be at least 3 chars long', 400);
    }

    await this.categoryService.update(id, body.name);
    return this.responseService.build<PostCategory>(await this.categoryService.get(id));
  }

  @PostReq('category')
  @UseGuards(AuthGuard('jwt'))
  public async create(@Body() body: {name: string}): Promise<APIResponse<PostCategory>> {
    if (!body) {
      throw new HttpException('Something went wrong', 500);
    }

    if (Object.keys(body).length === 0 || !body.name) {
      throw new HttpException('name cannot be empty', 400);
    }

    if (body.name.length < 3) {
      throw new HttpException('name must be at least 3 chars long', 400);
    }

    return this.responseService.build<PostCategory>(await this.categoryService.create(body.name));
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
  ): Promise<Pagination<Post>> {
    await this.categoryService.get(id);

    return this.postService.paginateCategoryPosts(id, true,{
      page,
      limit: environment.http.paginationLimit,
      route: `${environment.http.host}${environment.http.port !== 80 ? ':' + environment.http.port : ''}/category/${id}/posts`,
    })
  }
}
