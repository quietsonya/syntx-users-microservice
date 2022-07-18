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
} from '../users.pb'
import { InjectRepository } from '@nestjs/typeorm'
import { ClientGrpc } from '@nestjs/microservices'
import { EVENTBUS_PACKAGE_NAME, UsersEventsServiceClient, USERS_EVENTS_SERVICE_NAME } from 'src/users-events.pb'


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
        this.usersEventsService.getUserByIdEvent(user)
        return user
    }

    public async searchUsers({ usersIds, email, username }: SearchUsersParams): Promise<User[]> {
        const users: User[] = await this.userRepo.find({ where: {
            id: In(usersIds),
            email,
            username,
        } })
        this.usersEventsService.searchUsersEvent({
            searchParams: { usersIds, email, username },
            users
        })
        return users
    }

    public async createUser(dto: CreateUserRequest): Promise<User> {
        const user = new User()
        user.email = dto.email
        user.username = dto.username
        user.password = dto.password
        user.salt = dto.salt
        await this.userRepo.save(user)
        this.usersEventsService.createUserEvent(user)
        return user
    }

    public async updateUser(dto: UpdateUserRequest): Promise<User> {
        const user = await this.userRepo.findOneBy({ id: dto.userId })
        user.email = dto.email
        user.username = dto.username
        user.password = dto.password
        user.salt = dto.salt
        await this.userRepo.save(user)
        this.usersEventsService.updateUserEvent(user)
        return user
    }

    public async deleteUser({ userId }: DeleteUserRequest): Promise<User> {
        const user: User = await this.userRepo.findOneBy({ id: userId })
        await this.userRepo.delete(user)
        this.usersEventsService.deleteUserEvent(user)
        return user
    }

}
