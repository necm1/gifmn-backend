import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {User} from '../entity/user.entity';
import {UserRepository} from '../repository/user.repository';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  /**
   * UserRepository Constructor
   *
   * @constructor
   * @param usersRepository
   * @param cacheManager
   */
  constructor(
    private usersRepository: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManager
  ) {
    this.usersRepository.setProvider(cacheManager);
    this.findByUsername('necm1').then(value => console.log(value));
    this.usersRepository.update({username: 'necm1'}, {
      created_at: new Date()
    }).then(value => console.log('USER', value));
  }

  /**
   * Find User By Username
   *
   * @public
   * @param username
   * @returns Promise<User>
   */
 public async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({username});
  }


  /**
   * Remove User By ID
   *
   * @public
   * @param id
   */
  public async remove(id: number): Promise<void> {
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
