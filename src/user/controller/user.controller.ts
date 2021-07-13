import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {User} from '../entity/user.entity';
import {AuthGuard} from '@nestjs/passport';
import {ResponseService} from '../../_service/response.service';
import {APIResponse} from '../../_model/api-response.model';

@Controller('user')
/**
 * @class UserController
 */
export class UserController {
  constructor(
    private readonly response: ResponseService
  ) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  /**
   * Get Session User
   *
   * @public
   * @returns Promise<APIResponse<User>>
   */
  public async user(@Request() req): Promise<APIResponse<User>> {
    return this.response.build<User>(req.user);
  }
}
