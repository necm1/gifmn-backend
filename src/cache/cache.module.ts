import {CacheModule as NestCacheModule, Global, Module} from '@nestjs/common';
import {environment} from '../environment';
import {CacheService} from './service/cache.service';

@Global()
@Module({
  imports: [
    NestCacheModule.register({
      store: environment.cache.store,
      host: environment.cache.host,
      port: environment.cache.port,
      ttl: environment.cache.ttl
    }),
  ],
  providers: [CacheService],
  exports: [CacheService, NestCacheModule]
})
export class CacheModule {
}
