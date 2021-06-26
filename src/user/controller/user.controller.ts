import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {UserService} from '../service/user.service';
import {User} from '../entity/user.entity';
import {AuthService} from '../service/auth.service';
import {AuthGuard} from '@nestjs/passport';
import {PostService} from '../../post/service/post.service';

@Controller('user')
/**
 * @class UserController
 */
export class UserController {
  constructor(private postService: PostService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  /**
   * Get Session User
   *
   * @public
   * @returns User
   */
  public async user(@Request() req): Promise<User> {
    this.postService.findAll().then(value => {
      console.log(value[0]);
    });
    return req.user;
  }
}
