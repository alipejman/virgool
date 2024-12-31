import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import { swaggerConfigInit } from './config/swagger.config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  swaggerConfigInit(app);
  const {PORT, SWAGGER_ROOT, SERVER_LOG} = process.env;
  await app.listen(PORT, () => {
    console.log(SERVER_LOG);
    console.log(SWAGGER_ROOT);
  });
}
bootstrap();
