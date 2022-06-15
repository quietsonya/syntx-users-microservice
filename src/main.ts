import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { join } from 'path'
import { UsersModule } from './users.module'
import { USERS_PACKAGE_NAME } from './users.pb'

async function bootstrap() {
    const app = await NestFactory.createMicroservice(
        UsersModule,
        {
            transport: Transport.GRPC,
            options: {
                url: process.env.APP_URL,
                package: USERS_PACKAGE_NAME,
                protoPath: join(__dirname, '..', 'node_modules', 'syntx-protos', 'users', 'users.proto'),
            }
        },
    )
    await app.listen()
    console.log('Users service started at ' + process.env.APP_URL)
}
bootstrap()