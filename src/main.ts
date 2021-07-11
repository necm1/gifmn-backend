import {NestFactory} from '@nestjs/core';
import {FastifyAdapter, NestFastifyApplication} from '@nestjs/platform-fastify';
import {AppModule} from './app.module';
import {environment} from './environment';
import {HttpExceptionFilter} from './_filter/http-exception.filter';
import {ValidationPipe} from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({logger: !environment.production}),
    {
      logger: environment.http.logger
    }
  );

  app.enableCors(environment.cors);

  await app
    .useGlobalFilters(new HttpExceptionFilter())
    .useGlobalPipes(new ValidationPipe())
    .listen(environment.http.port, environment.http.host);
}
bootstrap();
