import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {UserService} from '../service/user.service';
import {User} from '../entity/user.entity';
import {AuthService} from '../service/auth.service';
import {AuthGuard} from '@nestjs/passport';

@Controller('user')
/**
 * @class UserController
 */
export class UserController {
  @UseGuards(AuthGuard('jwt'))
  @Get()
  /**
   * Get Session User
   *
   * @public
   * @returns User
   */
  public user(@Request() req): User {
    return req.user;
  }
}
