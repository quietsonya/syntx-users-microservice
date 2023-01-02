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
    Error,
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
        const user: User = await this.userRepo
            .findOneBy({ id: userId })
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.usersEventsService.getUserByIdEvent({ error, user: { id: userId } })
                throw new RpcException(error)
            })
        if (!user) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'User not found',
            }
            this.usersEventsService.getUserByIdEvent({ error, user: { id: userId } })
            throw new RpcException(error)
        }
        this.usersEventsService.getUserByIdEvent({ user })
        return user
    }

    public async searchUsers(searchParams: SearchUsersParams): Promise<User[]> {
        const users: User[] = await this.userRepo
            .find({
                where: {
                    id: In(searchParams.usersIds),
                    email: searchParams.email,
                    username: searchParams.username,
                },
                take: searchParams.limit,
                skip: searchParams.offset,
            })
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.usersEventsService.searchUsersEvent({
                    error,
                    users: searchParams.usersIds.map(id => ({ id })),
                    searchParams
                })
                throw new RpcException(error)
            })
        this.usersEventsService.searchUsersEvent({ users, searchParams })
        return users
    }

    public async createUser(dto: CreateUserRequest): Promise<User> {
        const user: User = await this.userRepo
            .save(dto)
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.usersEventsService.createUserEvent({ error, user: dto })
                throw new RpcException(error)
            })
        this.usersEventsService.createUserEvent({ user })
        return user
    }

    public async updateUser(dto: UpdateUserRequest): Promise<User> {
        const user: User = await this.userRepo
            .findOneBy({ id: dto.userId })
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.usersEventsService.updateUserEvent({ error, user: { ...dto, id: dto.userId, } })
                throw new RpcException(error)
            })
        if (!user) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'User not found',
            }
            this.usersEventsService.updateUserEvent({ error, user })
            throw new RpcException(error)
        }

        user.email = dto.email || user.email
        user.username = dto.username || user.username
        user.password = dto.password || user.password
        user.salt = dto.salt || user.salt
        await this.userRepo
            .save(user)
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.usersEventsService.updateUserEvent({ error, user })
                throw new RpcException(error)
            })

        this.usersEventsService.updateUserEvent({ user })
        return user
    }

    public async deleteUser({ userId }: DeleteUserRequest): Promise<User> {
        const user: User = await this.userRepo
            .findOneBy({ id: userId })
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.usersEventsService.deleteUserEvent({ error, user: { id: userId } })
                throw new RpcException(error)
            })
        if (!user) {
            const error: Error = {
                code: Status.NOT_FOUND,
                message: 'User not found',
            }
            this.usersEventsService.deleteUserEvent({ error, user: { id: userId } })
            throw new RpcException(error)
        }
        await this.userRepo
            .remove(user)
            .catch(err => {
                const error: Error = {
                    code: Status.UNAVAILABLE,
                    message: err,
                }
                this.usersEventsService.deleteUserEvent({ error, user })
                throw new RpcException(error)
            })
        this.usersEventsService.deleteUserEvent({ user })
        return user
    }

}
