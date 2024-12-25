import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerConfigInit } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  SwaggerConfigInit(app)
  app.useGlobalPipes(new ValidationPipe());
  let configService = app.get(ConfigService)
  app.enableCors(configService.get('App.cors'));
  let port = configService.get('App.port')
  await app.listen(port , ()=>{
    console.log(`server is running on port:${port}`)
  });
}
bootstrap();
