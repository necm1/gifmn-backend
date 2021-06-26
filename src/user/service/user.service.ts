import {Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {User} from '../entity/user.entity';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcryptjs';

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

  /**
   * Process Auth
   *
   * @public
   * @param username
   * @param pass
   * @returns Promise<User>
   */
  public async processAuth(username: string, pass: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      select: ['username', 'password'],
      where: {username}
    });

    if (!user || !bcrypt.compareSync(pass, user.password)) {
      return undefined;
    }

    // Exclude Password
    const {password, ...result} = user;

    return result as User
  }
}
