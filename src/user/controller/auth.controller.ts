import {Controller, Post, Request, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {AuthService} from '../service/auth.service';

@Controller('auth')
/**
 * @class AuthController
 */
export class AuthController {

  constructor(private readonly authService: AuthService) {
  }

  @UseGuards(AuthGuard('local'))
  @Post()
  public async login(@Request() req) {
    return this.authService.validate('necm1', 'test');
  }

}
