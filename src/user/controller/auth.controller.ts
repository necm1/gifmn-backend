import {Controller, Post, Request, UseFilters, UseGuards} from '@nestjs/common';
import {Throttle, ThrottlerGuard} from '@nestjs/throttler';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from '../service/auth.service';
import {HttpExceptionFilter} from '../../_filter/http-exception.filter';
import {ResponseService} from '../../_service/response.service';

@Controller('auth')
/**
 * @class AuthController
 */
export class AuthController {

  /**
   * AuthController Constructor
   *
   * @constructor
   * @param authService
   * @param responseService
   */
  constructor(
    private readonly authService: AuthService,
    private readonly responseService: ResponseService
  ) {
  }

  @UseGuards(AuthGuard('local'), ThrottlerGuard)
  @Throttle(5, 30)
  @Post()
  public async login(@Request() req) {
    return this.responseService.build<{access_token: string}>({
      access_token: await this.authService.login(req.user)
    });
  }

}
