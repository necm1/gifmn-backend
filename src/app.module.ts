import {Module} from '@nestjs/common';
import {environment} from './environment';
import * as path from 'path';
import {TypeOrmModule} from '@nestjs/typeorm';
import {SnakeNamingStrategy} from 'typeorm-naming-strategies';
import {UserModule} from './user/user.module';
import {PostModule} from './post/post.module';
import {CacheModule} from './cache/cache.module';

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
      migrations: [path.join(__dirname, '**/**.migration{.ts,.js}')],
      cli: {
        migrationsDir: 'migration'
      },
      keepConnectionAlive: true,
      logging: !environment.production,
      synchronize: false,
      namingStrategy: new SnakeNamingStrategy()
    }),
    UserModule,
    PostModule,
    CacheModule,
  ]
})
/**
 * @class AppModule
 */
export class AppModule {
}
