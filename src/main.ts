import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerConfigInit } from './config/swagger.config';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets("public")
  app.useGlobalPipes(new ValidationPipe())
  swaggerConfigInit(app);
  app.use(cookieParser( process.env.SECRET_KEY));
  const {PORT, SWAGGER_ROOT, SERVER_LOG} = process.env;
  await app.listen(PORT, () => {
    console.log(SERVER_LOG);
    console.log(SWAGGER_ROOT);
  });
}
bootstrap();
