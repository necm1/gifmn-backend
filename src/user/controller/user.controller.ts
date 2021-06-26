import {Controller, Get, Request, UseGuards} from '@nestjs/common';
import {UserService} from '../service/user.service';
import {User} from '../entity/user.entity';
import {AuthService} from '../service/auth.service';
import {AuthGuard} from '@nestjs/passport';

@Controller('user')
export class UserController {

  constructor(private readonly userRepository: UserService, private readonly authService: AuthService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  public user(@Request() req): User {
    return req.user;
  }
}
