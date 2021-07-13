import {Controller, Get, Param, Req, Post as PostReq, UseGuards, Body} from '@nestjs/common';
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
import {User} from '../../user/entity/user.entity';
import {UserService} from '../../user/service/user.service';

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
   */
  constructor(
    private attachmentService: AttachmentService,
    private responseService: ResponseService,
    private postService: PostService,
    private uploadService: UploadService,
    private categoryService: CategoryService,
    private userService: UserService
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
    @Req() req,
    @Body() data
  ): Promise<APIResponse<any>> {
    //const uploadedFiles: FileModel[] = await this.uploadService.upload(await req.files());
    const post: Post = await this.postService.create({
      category: await this.categoryService.get(1),
      user: await this.userService.findByUsername(req.user.username),
      title: 'test',
      description: 'test'
    });

    //const attachments: PostAttachment[] = await this.attachmentService.create(post, uploadedFiles);


    return this.responseService.build({});
  }
}
