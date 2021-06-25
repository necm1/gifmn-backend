import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../entity/user.entity';
import {Repository} from 'typeorm';

@Injectable()
export class UserService {
  /**
    * UserRepository Constructor
    *
    * @constructor
    * @param usersRepository
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * Find One
   *
   * @todo dont forget to add {cache: true} in options
   * @param username
   * @returns Promise<User>
   */
  async findOne(username: string): Promise<User> {
    return this.usersRepository.findOne({where: {username}});
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
