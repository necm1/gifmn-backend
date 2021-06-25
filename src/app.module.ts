import {Module} from '@nestjs/common';
import {environment} from './environment';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserModule} from './user/user.module';
import * as path from 'path';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: environment.database.host,
      port: environment.database.port,
      username: environment.database.user,
      password: environment.database.password,
      database: environment.database.name,
      entities: [path.join(__dirname, '**/**.entity{.ts,.js}')],
      migrations: [path.join(__dirname, '**/**.migration{.ts,.js}')],
      cli: {
        migrationsDir: 'migration'
      },
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
