import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { LoggerService } from './logger/logger.service'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // const app = await NestFactory.create(AppModule, { cors: true });
  const configService = app.get<ConfigService>(ConfigService)

  const config = new DocumentBuilder()
    .setTitle('Book Store example')
    .setDescription('The books API description')
    .setVersion('1.0')
    .addTag('books')
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const port = configService.get('port')
  // app.enableCors();
  app.useLogger(app.get(LoggerService))
  await app.listen(port)
}
bootstrap()
