import { Module } from '@nestjs/common'
import { UsersService } from './services/users.service'
import { UsersController } from './users.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import 'dotenv/config'
import { DataSource } from 'typeorm'
import { User } from './entities/user.entity'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [ `@${process.env.NODE_ENV}.env`, '@.env' ]
        }),
    ],
    controllers: [ UsersController ],
    providers: [
        UsersService,
        {
            inject: [ ConfigService ],
            provide: 'DATA_SOURCE',
            useFactory: async (config: ConfigService) => new DataSource({
                type: 'postgres',
                host: config.get('POSTGRES_HOST'),
                port: +config.get('POSTGRES_PORT'),
                username: config.get('POSTGRES_USERNAME'),
                password: config.get('POSTGRES_PASSWORD'),
                database: config.get('POSTGRES_DATABASE_NAME'),
                entities: [
                    User,
                ],
                synchronize: true,
            }).initialize()
        },
        {
            provide: 'USER_REPO',
            useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
            inject: [ 'DATA_SOURCE' ]
        }
    ],
})
export class UsersModule {}
