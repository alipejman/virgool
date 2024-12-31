import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export function typeormConfig(): TypeOrmModuleOptions {
    const {DB_HOST, DB_PASSWORD, DB_PORT, DB_USER, DB_NAME} = process.env
  return {
    type: 'postgres',
    host: DB_HOST,
    port: DB_PORT,
    username: DB_USER,
    database: DB_NAME,
    password: DB_PASSWORD,
    autoLoadEntities: false,
    synchronize: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
}
  }