import { INestApplication } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

export const configSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('Book Store example')
    .setDescription('The books API description')
    .addBearerAuth()
    .setVersion('1.0.0')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
}
