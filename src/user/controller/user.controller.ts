import {Controller, Get} from '@nestjs/common';
import {UserService} from '../service/user.service';
import {User} from '../entity/user.entity';
import {AuthService} from '../service/auth.service';

@Controller('user')
export class UserController {

  constructor(private readonly userRepository: UserService, private readonly authService: AuthService) {
  }

  @Get()
  public async user(): Promise<User> {
    console.log(await this.authService.validate('necm1', 't2est'))
    return this.userRepository.findOne('necm1');
  }
}
