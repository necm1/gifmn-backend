import {Controller, Delete, HttpException, Param, ParseIntPipe, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AttachmentService} from '../service/attachment.service';
import {environment} from '../../environment';
import {UploadService} from '../service/upload.service';
import {PostService} from '../service/post.service';
import {ResponseService} from '../../_service/response.service';
import {APIResponse} from '../../_model/api-response.model';

@Controller('attachment')
export class AttachmentController {

  constructor(
    private attachmentService: AttachmentService,
    private uploadService: UploadService,
    private postService: PostService,
    private responseService: ResponseService
  ) {
  }

  @Delete(':url')
  @UseGuards(AuthGuard('jwt'))
  public async deleteByUrl(
    @Param('url') url: string,
  ): Promise<APIResponse<boolean>> {
    if (!url) {
      throw new HttpException('Missing parameter "url"', 400);
    }

    if (url.length != 7) {
      throw new HttpException('Invalid parameter length', 400);
    }

    const entity = await this.attachmentService.getByURL(url, false, false);

    // Delete Attachment from Database
    const success = await this.attachmentService.deleteByUrl(url);

    // Update Post in Cache
    await this.postService.get(entity.post.id, true);

    // Delete Local Attachment File
    await this.uploadService.delete(entity.url, entity.type);

    return this.responseService.build<boolean>(success);
  }
}
