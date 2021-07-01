import {Controller, Get, Param} from '@nestjs/common';
import {AttachmentService} from '../service/attachment.service';
import {APIResponse} from '../../_model/api-response.model';
import {PostAttachment} from '../entity/post-attachment.entity';
import {ResponseService} from '../../_service/response.service';
import {Post} from '../entity/post.entity';

@Controller('post')
/**
 * @class PostController
 */
export class PostController {
  constructor(
    private attachmentService: AttachmentService,
    private responseService: ResponseService
  ) {
  }

  @Get(':url')
  /**
   * Get Post By First Attachment URL
   * @async
   * @public
   * @param url
   * @returns Promise<APIResponse<Post>>
   */
  public async getPostByURL(@Param('url') url: string): Promise<APIResponse<Post>> {
    return this.responseService.build<Post>((await this.attachmentService.getByURL(url)).post);
  }
}
