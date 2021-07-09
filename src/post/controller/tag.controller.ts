import {Body, Controller, Delete, HttpException, Param, Put, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ResponseService} from '../../_service/response.service';
import {TagService} from '../service/tag.service';
import {APIResponse} from '../../_model/api-response.model';
import {PostTag} from '../entity/post-tag.entity';
import {MissingParameterException} from '../../_exception/missing-parameter.exception';
import {TagNotFoundException} from '../exception/tag-not-found.exception';

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
  /**
   * Delete Tag by ID
   *
   * @public
   * @async
   * @params id
   * @returns Promise<APIResponse<unknown>>
   */
  public async delete(@Param('id') id: number): Promise<APIResponse<unknown>> {
    await this.tagService.delete(id);

    return this.response.build({});
  }

  @Put(':id')
  /**
   * Update Tag
   *
   * @public
   * @async
   * @param id
   * @param tag
   * @returns Promise<APIResponse<PostTag>>
   */
  public async update(
    @Param('id') id: number,
    @Body() tag: PostTag
  ): Promise<APIResponse<PostTag>> {
    const entity: PostTag = await this.tagService.get(id);

    if (!entity) {
      throw new TagNotFoundException(id);
    }

    if (!tag) {
      throw new HttpException('Missing Tag Parameters',400);
    }

    Object.keys(tag).forEach(key => {
      if (!(key in entity)) {
        throw new HttpException(`Could not find key "${key}" in Tag structure`, 400);
      }
    })

    await this.tagService.update(tag, id);
    return this.response.build<PostTag>(await this.tagService.get(id));
  }
}
