import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import {APP_GUARD} from '@nestjs/core';
import {User} from './entity/user.entity';
import {UserService} from './service/user.service';
import {AuthService} from './service/auth.service';
import {UserController} from './controller/user.controller';
import {AuthController} from './controller/auth.controller';
import {environment} from '../environment';
import {JwtStrategy} from './strategy/jwt.strategy';
import {PostModule} from '../post/post.module';
import {ResponseService} from '../_service/response.service';
import {UserRepository} from './repository/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserRepository]),
    PassportModule,
    JwtModule.register({
      secret: environment.auth.secret,
      signOptions: {expiresIn: environment.auth.expireIn},
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    })
  ],
  providers: [
    UserService,
    AuthService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    ResponseService
  ],
  controllers: [UserController, AuthController],
  exports: [JwtModule, TypeOrmModule, UserService]
})
export class UserModule {
}
