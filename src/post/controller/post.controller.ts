import {
  Controller,
  Get,
  Param,
  Req,
  Post as PostReq,
  UseGuards,
  HttpException, Put, Body, Delete
} from '@nestjs/common';
import {AttachmentService} from '../service/attachment.service';
import {APIResponse} from '../../_model/api-response.model';
import {ResponseService} from '../../_service/response.service';
import {Post} from '../entity/post.entity';
import {AuthGuard} from '@nestjs/passport';
import {PostService} from '../service/post.service';
import {UploadService} from '../service/upload.service';
import {FileModel} from '../model/file.model';
import {CategoryService} from '../service/category.service';
import {UserService} from '../../user/service/user.service';
import {TagService} from '../service/tag.service';
import {PostTag} from '../entity/post-tag.entity';
import {environment} from '../../environment';

@Controller('post')
/**
 * @class PostController
 */
export class PostController {
  /**
   * PostController Constructor
   *
   * @constructor
   * @param attachmentService
   * @param responseService
   * @param postService
   * @param uploadService
   * @param categoryService
   * @param userService
   * @param tagService
   */
  constructor(
    private attachmentService: AttachmentService,
    private responseService: ResponseService,
    private postService: PostService,
    private uploadService: UploadService,
    private categoryService: CategoryService,
    private userService: UserService,
    private tagService: TagService
  ) {
  }

  /**
   * @public
   * @async
   * @param body
   * @returns Promise<APIResponse<Post[]>>
   */
  @PostReq('search')
  public async search(@Body() body: {query: string}): Promise<APIResponse<Post[]>> {
    if (!body || !body.query) {
      return;
    }

    const query = (body.query as any).value;

    const posts: Post[] = [];

    const postQuery = await this.postService.search(query);

    if (postQuery && postQuery.length > 0) {
      postQuery.forEach(value => posts.push(value));
    }

    const attachmentQuery = await this.attachmentService.search(query);

    if (attachmentQuery && attachmentQuery.length > 0) {
      attachmentQuery.forEach(value => {
        const entity = posts.filter(entry => entry.id === value.id);

        if (entity && entity[0]) {
          return;
        }

        posts.push(value.post);
      });
    }

    const tagQuery = await this.tagService.search(query);

    if (tagQuery && tagQuery.length > 0) {
      tagQuery.forEach(value => {
        const entity = posts.filter(entry => entry.id === value.id);

        if (entity && entity[0]) {
          return;
        }

        posts.push(value.post);
      })
    }

    return this.responseService.build<Post[]>(posts);
  }

  /**
   * Delete post with all data
   * and files
   *
   * @public
   * @async
   * @param id
   */
  @Delete(':id')
  public async delete(@Param('id') id: number) {
    const entity = await this.postService.get(id);

    for (const value of entity.attachments) {
      await this.attachmentService.deleteByUrl(value.url);
      await this.uploadService.delete(value.url, value.type);
    }

    for (const tag of entity.tags) {
      await this.tagService.delete(tag.id);
    }

    return this.responseService.build<boolean>(await this.postService.delete(id));
  }

  @Get(':url')
  /**
   * Get Post By First Attachment URL
   *
   * @public
   * @async
   * @param url
   * @returns Promise<APIResponse<Post>>
   */
  public async getPostByURL(@Param('url') url: string): Promise<APIResponse<Post>> {
    return this.responseService.build<Post>((await this.attachmentService.getByURL(url)).post);
  }

  @PostReq()
  @UseGuards(AuthGuard('jwt'))
  public async upload(
    @Req() req
  ): Promise<APIResponse<any>> {
    const body = req.body;

    // @TODO write validator...
    if (!body || !body.images || !body.post || !body.attachments) {
      throw new HttpException('Missing images, post or attachments', 400);
    }

    const parsedPost = JSON.parse(body.post.value);

    // Create Post
    const post: Post = await this.postService.create({
      category: await this.categoryService.get(parsedPost.category),
      user: await this.userService.findByUsername(parsedPost.user),
      title: parsedPost.title,
      description: parsedPost.description,
    });

    // Upload Files
    const uploadedFiles: FileModel[] = await this.uploadService.upload(!(body.images instanceof Array) ? [body.images] : body.images);

    // Create Attachments
    await this.attachmentService.create(post, uploadedFiles, body?.attachments?.value ? JSON.parse(req.body?.attachments.value) : {});

    // Create Tags
    if (body.tags?.value) {
      await this.tagService.create(JSON.parse(body.tags.value), post);
    }

    // Update Cache
    await this.postService.paginateCategoryPosts(parsedPost.category, true, {
      page: 1,
      limit: environment.http.paginationLimit
    });

    return this.responseService.build(await this.postService.get(post.id, true));
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'))
  public async edit(
    @Req() req,
    @Param('id') id: number,
  ): Promise<APIResponse<any>> {
    const body = req.body;

    // @TODO write validator...
    if (!body || !body.post) {
      throw new HttpException('Missing post data', 400);
    }

    const entity: Post = await this.postService.get(id);

    const parsedPost: Post = JSON.parse(body.post.value);

    parsedPost.user = await this.userService.findByUsername(parsedPost.user as any);

    if (id != parsedPost.id) {
      throw new HttpException('Post ID is not identical with ID in JSON structure' + id + parsedPost.id, 400);
    }

    await this.postService.update(parsedPost, id);

    if (body.images && (body.images.filename || body.images[0]?.filename)) {
      // Upload Files
      const uploadedFiles = await this.uploadService.upload(!(body.images instanceof Array) ? [body.images] : body.images);

      // Create Attachments
      await this.attachmentService.create(entity, uploadedFiles, body?.attachments?.value ? JSON.parse(body?.attachments.value).filter(key => !key.id && !key.url) : {});
    }

    if (body.attachments?.value) {
      await this.attachmentService.update(body?.attachments?.value ? JSON.parse(body.attachments?.value).filter(key => key.id) : {});
    }

    // Create Tags
    if (body.tags?.value) {
      const parsedTags = JSON.parse(body.tags.value);

      const needToCreate = parsedTags.filter(tag => !tag.id);

      if (needToCreate) {
        await this.tagService.create(needToCreate, entity);
      }

      const needToUpdate = parsedTags.filter(tag => tag.id);

      if (needToUpdate) {
        for (const tag of needToUpdate) {
          await this.tagService.update(tag, tag.id);
        }
      }
    }

    // Update Cache
    await this.postService.paginateCategoryPosts(entity.category.id, true, {
      page: 1,
      limit: environment.http.paginationLimit
    });

    return this.responseService.build(await this.postService.get(id, true));
  }
}
