import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";

export const TypeOrmAsyncConfig: TypeOrmModuleAsyncOptions={
    useFactory: async (): Promise<TypeOrmModuleOptions> => {
        return { 
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USERNAME,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
            // logging: true
        }
    }
}