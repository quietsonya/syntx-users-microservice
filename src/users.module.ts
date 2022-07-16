import { Module } from '@nestjs/common'
import { UsersService } from './services/users.service'
import { UsersController } from './users.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import 'dotenv/config'
import { User } from './entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [ `@${process.env.NODE_ENV}.env`, '@.env' ],
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ ConfigService ],
            useFactory: async (config: ConfigService) => ({
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
            })
        }),
        TypeOrmModule.forFeature([
            User,
        ]),
    ],
    controllers: [ UsersController ],
    providers: [
        UsersService,
    ],
})
export class UsersModule {}
