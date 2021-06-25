import {Module} from '@nestjs/common';
import {environment} from './environment';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from './user/user.module';
import * as path from 'path';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: environment.database.host,
      port: environment.database.port,
      username: environment.database.user,
      password: environment.database.password,
      database: environment.database.name,
      entities: [path.join(__dirname, '**/**.entity{.ts,.js}')],
      keepConnectionAlive: true,
      logging: !environment.production,
      synchronize: false
    }),
    UserModule
  ],
  controllers: [],
  providers: [],
})
/**
 * @class AppModule
 */
export class AppModule {
}
