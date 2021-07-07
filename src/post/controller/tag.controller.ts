import {Controller, Delete, Param, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ResponseService} from '../../_service/response.service';
import {TagService} from '../service/tag.service';
import {APIResponse} from '../../_model/api-response.model';

@Controller('tag')
@UseGuards(AuthGuard('jwt'))
/**
 * @class TagController
 */
export class TagController {
  constructor(
    private response: ResponseService,
    private tagService: TagService
  ) {
  }

  @Delete(':id')
  public async deleteTag(@Param('id') id: number): Promise<APIResponse<unknown>> {
    await this.tagService.delete(id);

    return this.response.build({});
  }
}
