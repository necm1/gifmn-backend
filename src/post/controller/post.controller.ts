import {Controller, Get, Param, Req, Post as PostReq, UseGuards} from '@nestjs/common';
import {AttachmentService} from '../service/attachment.service';
import {APIResponse} from '../../_model/api-response.model';
import {ResponseService} from '../../_service/response.service';
import {Post} from '../entity/post.entity';
import {AuthGuard} from '@nestjs/passport';
import {PostService} from '../service/post.service';
import {UploadService} from '../service/upload.service';

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
   */
  constructor(
    private attachmentService: AttachmentService,
    private responseService: ResponseService,
    private postService: PostService,
    private uploadService: UploadService
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
  public async upload(@Req() req): Promise<APIResponse<any>> {
    return this.responseService.build(await this.uploadService.upload(await req.files()));
  }
}
