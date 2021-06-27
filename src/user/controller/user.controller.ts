import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {UserService} from '../service/user.service';
import {User} from '../entity/user.entity';
import {AuthService} from '../service/auth.service';
import {AuthGuard} from '@nestjs/passport';
import {PostService} from '../../post/service/post.service';
import {ResponseService} from '../../_service/response.service';
import {APIResponse} from '../../_model/api-response.model';

@Controller('user')
/**
 * @class UserController
 */
export class UserController {
  constructor(
    private postService: PostService,
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
    this.postService.findAll().then(value => {
      console.log(value[0]);
    });

    return this.response.build<User>(req.user);
  }
}
