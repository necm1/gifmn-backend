import {ExtractJwt, Strategy} from 'passport-jwt';
import {PassportStrategy} from '@nestjs/passport';
import {Injectable} from '@nestjs/common';
import {environment} from '../../environment';

@Injectable()
/**
 * @class JwtStrategy
 * @extends PassportStrategy(Strategy)
 */
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * JwtStrategy Constructor
   *
   * @constructor
   */
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: environment.auth.secret,
    });
  }

  /**
   * Validate Token
   *
   * @public
   * @param payload
   * @returns Promise<{userId: string | number, username: string}>
   */
  public async validate(payload: any): Promise<{userId: string | number, username: string}> {
    return {userId: payload.sub, username: payload.username};
  }
}
