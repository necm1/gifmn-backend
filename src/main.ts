import {NestFactory} from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import {AppModule} from './app.module';
import {environment} from './environment';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({logger: !environment.production})
  );

  await app.listen(environment.http.port, environment.http.host);
}
bootstrap();
