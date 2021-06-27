import {Controller, Post, Request, UseFilters, UseGuards} from '@nestjs/common';
import {Throttle, ThrottlerGuard} from '@nestjs/throttler';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from '../service/auth.service';
import {HttpExceptionFilter} from '../../_filter/http-exception.filter';

@Controller('auth')
/**
 * @class AuthController
 */
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) {
  }

  @UseGuards(AuthGuard('local'), ThrottlerGuard)
  @Throttle(5, 30)
  @Post()
  public async login(@Request() req) {
    return this.authService.login(req.user);
  }

}
