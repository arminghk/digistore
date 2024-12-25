import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function SwaggerConfigInit(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('digistore')
    .setDescription('The digistore API description')
    .setVersion('1.0')
    .addTag('digistore')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
}
