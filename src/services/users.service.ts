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
import { CacheServiceClient, CACHE_PACKAGE_NAME, CACHE_SERVICE_NAME } from 'src/cache.pb'


@Injectable()
export class UsersService {

    private cacheService: CacheServiceClient

    @Inject(CACHE_PACKAGE_NAME)
    private readonly client: ClientGrpc

    onModuleInit(): void {
        this.cacheService = this.client.getService<CacheServiceClient>(CACHE_SERVICE_NAME)
    }

    constructor(
        @InjectRepository(User) private readonly userRepo: Repository<User>
    ) {}

    public async getUserById({ userId }: UserId): Promise<User> {
        const user: User = await this.userRepo.findOneBy({ id: userId })
        this.cacheService.setCacheByKey({
            key: {
                packageName: CACHE_PACKAGE_NAME,
                rpcMethod: 'getUserById',
                rpcArg: JSON.stringify({ userId: user.id }),
            },
            data: JSON.stringify(user),
        })
        return user
    }

    public async searchUsers({ usersIds, email, username }: SearchUsersParams): Promise<User[]> {
        const users = this.userRepo.find({ where: {
            id: In(usersIds),
            email,
            username,
        } })
        return users
    }

    public async createUser(dto: CreateUserRequest): Promise<User> {
        const user = new User()
        user.email = dto.email
        user.username = dto.username
        user.password = dto.password
        user.salt = dto.salt
        await this.userRepo.save(user)
        this.cacheService.setCacheByKey({
            key: {
                packageName: CACHE_PACKAGE_NAME,
                rpcMethod: 'getUserById',
                rpcArg: JSON.stringify({ userId: user.id }),
            },
            data: JSON.stringify(user),
        })
        return user
    }

    public async updateUser(dto: UpdateUserRequest): Promise<User> {
        const user = await this.userRepo.findOneBy({ id: dto.userId })
        user.email = dto.email
        user.username = dto.username
        user.password = dto.password
        user.salt = dto.salt
        this.cacheService.setCacheByKey({
            key: {
                packageName: CACHE_PACKAGE_NAME,
                rpcMethod: 'getUserById',
                rpcArg: JSON.stringify({ userId: user.id }),
            },
            data: JSON.stringify(user),
        })
        await this.userRepo.save(user)
        return user
    }

    public async deleteUser({ userId }: DeleteUserRequest): Promise<User> {
        const user: User = await this.userRepo.findOneBy({ id: userId })
        this.cacheService.delCacheByKey({
            packageName: CACHE_PACKAGE_NAME,
            rpcMethod: 'getUserById',
            rpcArg: JSON.stringify({ userId: user.id }),
        })
        await this.userRepo.delete(user)
        return user
    }

}
