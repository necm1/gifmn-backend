import {Injectable, UnauthorizedException} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from '../entity/user.entity';
import * as bcrypt from 'bcryptjs'
import {JwtService} from '@nestjs/jwt';
import {Strategy} from 'passport-local';
import {PassportStrategy} from '@nestjs/passport';

@Injectable()
/**
 * @class AuthService
 * @extends PassportStrategy(Strategy)
 */
export class AuthService extends PassportStrategy(Strategy) {

  /**
   * AuthService Constructor
   *
   * @constructor
   * @param userService
   * @param jwtService
   */
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {
    super();
  }

  /**
   * Validate User
   *
   * @public
   * @param username
   * @param pass
   * @returns Promise<User>
   */
  public async validate(username: string, pass: string): Promise<User> {
    const user = await this.userService.findOne(username);

    if (!user || !bcrypt.compareSync(pass, user.password)) {
      throw new UnauthorizedException();
    }

    const {password, ...result} = user;
    return result as User;
  }

  /**
   * Login User
   *
   * @public
   * @param user
   * @returns Promise<{access_token: string}>
   */
  public async login(user: User): Promise<{access_token: string}> {
    const payload = {username: user.username, sub: user.id};

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
