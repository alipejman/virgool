import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { SecuritySchemeObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export function swaggerConfigInit(app: INestApplication) : void {
  const options = new DocumentBuilder()
    .setTitle('Virgool API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth(swaggerAuthConfig(), "Authorization")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}


function swaggerAuthConfig(): SecuritySchemeObject {
  return {
    type: 'http',
    bearerFormat:"JWT",  
    in: 'header',
    scheme: 'bearer',
  }}