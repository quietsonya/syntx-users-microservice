import { Inject, Injectable } from '@nestjs/common'
import 'dotenv/config'
import { User } from 'src/entities/user.entity'
import { In, Repository } from 'typeorm'
import {
    UserId,
    SearchUsersParams,
    CreateUserRequest,
    DeleteUserRequest,
    UpdateUserRequest,
} from '../pb/users.pb'
import { InjectRepository } from '@nestjs/typeorm'
import { ClientGrpc, RpcException } from '@nestjs/microservices'
import {
    EVENTBUS_PACKAGE_NAME,
    UsersEventsServiceClient,
    USERS_EVENTS_SERVICE_NAME,
} from 'src/pb/users-events.pb'
import { Status } from '@grpc/grpc-js/build/src/constants'


@Injectable()
export class UsersService {

    private usersEventsService: UsersEventsServiceClient

    @Inject(EVENTBUS_PACKAGE_NAME)
    private readonly client: ClientGrpc

    onModuleInit(): void {
        this.usersEventsService = this.client.getService<UsersEventsServiceClient>(USERS_EVENTS_SERVICE_NAME)
    }

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>
    ) {}

    public async getUserById({ userId }: UserId): Promise<User> {
        const user: User = await this.userRepo.findOneBy({ id: userId })
        if (!user) {
            user.id = userId
            throw new RpcException({ code: Status.NOT_FOUND })
        }
        this.usersEventsService.getUserByIdEvent(user)
        return user
    }

    public async searchUsers({ usersIds, email, username }: SearchUsersParams): Promise<User[]> {
        const users: User[] = await this.userRepo.find({ where: {
            id: In(usersIds),
            email,
            username,
        } })
        if (!users) {
            users.forEach((user, index) => user.id = usersIds[index])
            throw new RpcException({ code: Status.NOT_FOUND })
        }
        this.usersEventsService.searchUsersEvent({
            searchParams: { usersIds, email, username },
            users
        })
        return users
    }

    public async createUser(dto: CreateUserRequest): Promise<User> {
        const user: User = await this.userRepo.save(dto)
        if (!user) {
            throw new RpcException({ code: Status.UNAVAILABLE })
        }
        this.usersEventsService.createUserEvent(user)
        return user
    }

    public async updateUser(dto: UpdateUserRequest): Promise<User> {
        const user: User = await this.userRepo.findOneBy({ id: dto.userId })
        if (!user) {
            throw new RpcException({ code: Status.NOT_FOUND })
        }
        user.email = dto.email || user.email
        user.username = dto.username || user.username
        user.password = dto.password || user.password
        user.salt = dto.salt || user.salt
        const updatedUser: User = await this.userRepo.save(user)
        if (!updatedUser) {
            updatedUser.id = dto.userId
            throw new RpcException({ code: Status.UNAVAILABLE })
        }
        this.usersEventsService.updateUserEvent(updatedUser)
        return user
    }

    public async deleteUser({ userId }: DeleteUserRequest): Promise<User> {
        const user: User = await this.userRepo.findOneBy({ id: userId })
        if (!user) {
            throw new RpcException({ code: Status.NOT_FOUND })
        }
        const deletedUser: User = await this.userRepo.remove(user)
        if (!deletedUser) {
            deletedUser.id = userId
            throw new RpcException({ code: Status.UNAVAILABLE })
        }
        this.usersEventsService.deleteUserEvent(user)
        return user
    }

}
