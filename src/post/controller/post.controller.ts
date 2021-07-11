import {Controller, Get, Param, Req, Post as PostReq, HttpException, UseGuards} from '@nestjs/common';
import {AttachmentService} from '../service/attachment.service';
import {APIResponse} from '../../_model/api-response.model';
import {ResponseService} from '../../_service/response.service';
import {Post} from '../entity/post.entity';
import {AuthGuard} from '@nestjs/passport';
import {MissingParameterException} from '../../_exception/missing-parameter.exception';
import {environment} from '../../environment';

@Controller('post')
/**
 * @class PostController
 */
export class PostController {
  /**
   * @private
   * @property
   */
  private mimeTypes: string[] = environment.upload.allowedImages;

  /**
   * PostController Constructor
   *
   * @constructor
   * @param attachmentService
   * @param responseService
   */
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

  @PostReq()
  @UseGuards(AuthGuard('jwt'))
  public async upload(@Req() req): Promise<APIResponse<any>> {
    const mp = req.multipart(await this.handleUpload, err => {
      if (err) {
        throw new HttpException(err, 400);
      }

      console.log('success');
    });
    return this.responseService.build({});
  }

  private async handleUpload(field: string, file: any, filename: string, encoding: any, type: any) {
    if (field !== 'images') {
      throw new MissingParameterException('images');
    }

    console.log(field, filename, encoding, type);
  }
}
