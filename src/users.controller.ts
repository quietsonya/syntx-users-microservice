import { Controller, Inject } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import {
    USERS_SERVICE_NAME,
    User as ProtoUser,
    UsersServiceController,
    CreateUserRequest,
    UpdateUserRequest,
    DeleteUserRequest,
    UserId,
    SearchUsersParams
} from './users.pb'
import { UsersService } from './services/users.service'
import { concatMap, from, Observable } from 'rxjs'

@Controller()
export class UsersController implements UsersServiceController {

    @Inject(UsersService)
    private readonly usersService: UsersService

    @GrpcMethod(USERS_SERVICE_NAME, 'getUserById')
    public getUserById(dto: UserId): Observable<ProtoUser> {
        return from(this.usersService.getUserById(dto))
    }

    @GrpcMethod(USERS_SERVICE_NAME, 'searchUsers')
    public searchUsers(dto: SearchUsersParams): Observable<ProtoUser> {
        return from(this.usersService.searchUsers(dto)).pipe(concatMap(x => x))
    }

    @GrpcMethod(USERS_SERVICE_NAME, 'createUser')
    public createUser(dto: CreateUserRequest): Observable<ProtoUser> {
        return from(this.usersService.createUser(dto))
    }

    @GrpcMethod(USERS_SERVICE_NAME, 'updateUser')
    public updateUser(dto: UpdateUserRequest): Observable<ProtoUser> {
        return from(this.usersService.updateUser(dto))
    }

    @GrpcMethod(USERS_SERVICE_NAME, 'deleteUser')
    public deleteUser(dto: DeleteUserRequest): Observable<ProtoUser> {
        return from(this.usersService.deleteUser(dto))
    }

}