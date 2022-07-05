import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { LoggerService } from './logger/logger.service'
import { AppModule } from './app.module'
import { configSwagger } from './swagger/config-swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get<ConfigService>(ConfigService)

  configSwagger(app)

  const port = configService.get('port')
  app.useLogger(app.get(LoggerService))
  await app.listen(port)
}
bootstrap()
