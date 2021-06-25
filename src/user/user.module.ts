import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {User} from './entity/user.entity';
import {UserService} from './service/user.service';
import {UserController} from './controller/user.controller';
import {AuthService} from './service/auth.service';
import {AuthController} from './controller/auth.controller';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {environment} from '../environment';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: environment.auth.secret,
      signOptions: {expiresIn: environment.auth.expireIn},
    }),
  ],
  providers: [UserService, AuthService],
  controllers: [UserController, AuthController],
  exports: [JwtModule]
})
export class UserModule {}
