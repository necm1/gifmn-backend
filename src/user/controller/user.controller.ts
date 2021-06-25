import {Controller, Get} from '@nestjs/common';
import {UserService} from '../service/user.service';
import {User} from '../entity/user.entity';

@Controller('user')
export class UserController {

  constructor(private readonly userRepository: UserService) {
  }

  @Get()
  public async user(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}
