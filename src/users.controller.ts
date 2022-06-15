import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { USERS_SERVICE_NAME, User as ProtoUser, UsersServiceController } from './users.pb'
import { UsersService } from './services/users.service'
import { GetUserByIdDto } from './dto/get-user-by-id.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { concatMap, from, Observable } from 'rxjs'
import { UpdateUserDto } from './dto/update-user.dto'
import { DeleteUserDto } from './dto/delete-user.dto'

@Controller()
export class UsersController implements UsersServiceController {

    @Inject(UsersService)
    private readonly usersService: UsersService

    @GrpcMethod(USERS_SERVICE_NAME, 'getUserById')
    public getUserById(dto: GetUserByIdDto): Observable<ProtoUser> {
        return from(this.usersService.getUserById(dto))
    }

    @GrpcMethod(USERS_SERVICE_NAME, 'getUsers')
    public getUsers(): Observable<ProtoUser> {
        return from(this.usersService.getUsers()).pipe(concatMap(x => x))
    }

    @GrpcMethod(USERS_SERVICE_NAME, 'createUser')
    public createUser(dto: CreateUserDto): Observable<ProtoUser> {
        return from(this.usersService.createUser(dto))
    }

    @GrpcMethod(USERS_SERVICE_NAME, 'updateUser')
    public updateUser(dto: UpdateUserDto): Observable<ProtoUser> {
        return from(this.usersService.updateUser(dto))
    }

    @GrpcMethod(USERS_SERVICE_NAME, 'deleteUser')
    public deleteUser(dto: DeleteUserDto): Observable<ProtoUser> {
        return from(this.usersService.deleteUser(dto))
    }

}