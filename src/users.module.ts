import { Module } from '@nestjs/common'
import { UsersService } from './services/users.service'
import { UsersController } from './users.controller'
import { ConfigModule, ConfigService } from '@nestjs/config'
import 'dotenv/config'
import { User } from './entities/user.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { EVENTBUS_PACKAGE_NAME } from './pb/users-events.pb'
import { join } from 'path'

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: [ `@${process.env.NODE_ENV}.env`, '@.env' ],
            isGlobal: true,
        }),
        ClientsModule.register([
            {
                name: EVENTBUS_PACKAGE_NAME,
                transport: Transport.GRPC,
                options: {
                    url: '127.0.0.1:50057',
                    package: EVENTBUS_PACKAGE_NAME,
                    protoPath: join(
                        __dirname, '..', 'node_modules', 'syntx-protos', 'eventbus', 'users-events.proto'
                    ),
                }
            }
        ]),
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
