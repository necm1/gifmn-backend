import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  public yarro(): void {
    console.log('wtf geht hier ab CAHCE')
  }
}
