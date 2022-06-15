import { Module } from '@nestjs/common'
import { UsersService } from './services/users.service'
import { UsersController } from './users.controller'
import { ConfigModule } from '@nestjs/config'
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
            provide: 'DATA_SOURCE',
            useFactory: async () => new DataSource({
                type: 'postgres',
                host: process.env.POSTGRES_HOST,
                port: +process.env.POSTGRES_PORT,
                username: process.env.POSTGRES_USERNAME,
                password: process.env.POSTGRES_PASSWORD,
                database: process.env.POSTGRES_DATABASE_NAME,
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
