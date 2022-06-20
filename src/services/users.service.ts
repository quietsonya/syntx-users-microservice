import { Inject, Injectable } from '@nestjs/common'
import 'dotenv/config'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import {
    UserByIdRequest,
    UserByEmailRequest,
    CreateUserRequest,
    DeleteUserRequest,
    UpdateUserRequest,
} from '../users.pb'


@Injectable()
export class UsersService {

    constructor(
        @Inject('USER_REPO') private readonly userRepo: Repository<User>
    ) {}

    public async getUserById({ userId }: UserByIdRequest): Promise<User> {
        return this.userRepo.findOneBy({ id: userId })
    }

    public async getUserByEmail({ email }: UserByEmailRequest): Promise<User> {
        return this.userRepo.findOneBy({ email: email })
    }

    public async getUsers(): Promise<User[]> {
        return this.userRepo.find()
    }

    public async createUser(dto: CreateUserRequest): Promise<User> {
        const user = new User()
        user.email = dto.email
        user.username = dto.username
        user.password = dto.password
        user.salt = dto.salt
        await this.userRepo.save(user)
        return user
    }

    public async updateUser(dto: UpdateUserRequest): Promise<User> {
        const user = await this.userRepo.findOneBy({ id: dto.userId })
        user.email = dto.email
        user.username = dto.username
        user.password = dto.password
        user.salt = dto.salt
        await this.userRepo.save(user)
        return user
    }

    public async deleteUser({ userId }: DeleteUserRequest): Promise<User> {
        const user: User = await this.userRepo.findOneBy({ id: userId })
        await this.userRepo.delete(user)
        return user
    }

}
