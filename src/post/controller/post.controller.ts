import {
  Controller,
  Get,
  Param,
  Req,
  Post as PostReq,
  UseGuards,
  Body,
  UseInterceptors,
  HttpException
} from '@nestjs/common';
import {AttachmentService} from '../service/attachment.service';
import {APIResponse} from '../../_model/api-response.model';
import {ResponseService} from '../../_service/response.service';
import {Post} from '../entity/post.entity';
import {AuthGuard} from '@nestjs/passport';
import {PostService} from '../service/post.service';
import {UploadService} from '../service/upload.service';
import {PostAttachment} from '../entity/post-attachment.entity';
import {FileModel} from '../model/file.model';
import {CategoryService} from '../service/category.service';
import {UserService} from '../../user/service/user.service';
import {TagService} from '../service/tag.service';

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
      description: parsedPost.description
    });

    // Upload Files
    const uploadedFiles: FileModel[] = await this.uploadService.upload(!(body.images instanceof Array) ? [body.images] : body.images);

    // Create Attachments
    const attachments: PostAttachment[] = await this.attachmentService.create(post, uploadedFiles, body?.attachments ? JSON.parse(req.body?.attachments.value) : {});

    // Create Tags
    if (body.tags?.value) {
      await this.tagService.create(JSON.parse(body.tags.value), post);
    }

    // Update Cache
    await this.postService.paginateCategoryPosts(parsedPost.category, true, {page: 1, limit: 10});

    return this.responseService.build(await this.postService.get(post.id, true));
  }
}
