import { Inject, Injectable } from '@nestjs/common'
import { CreateUserDto } from 'src/dto/create-user.dto'
import { GetUserByIdDto } from 'src/dto/get-user-by-id.dto'
import 'dotenv/config'
import { User } from 'src/entities/user.entity'
import { Repository } from 'typeorm'
import { DeleteUserDto } from 'src/dto/delete-user.dto'
import { UpdateUserDto } from 'src/dto/update-user.dto'


@Injectable()
export class UsersService {

    constructor(
        @Inject('USER_REPO') private readonly userRepo: Repository<User>
    ) {}

    public async getUserById({ userId }: GetUserByIdDto): Promise<User> {
        return this.userRepo.findOneBy({ id: userId })
    }

    public async getUsers(): Promise<User[]> {
        return this.userRepo.find()
    }

    public async createUser(dto: CreateUserDto): Promise<User> {
        const user = new User()
        user.email = dto.email
        user.username = dto.username
        user.password = dto.password
        user.salt = dto.salt
        await this.userRepo.save(user)
        return user
    }

    public async updateUser(dto: UpdateUserDto): Promise<User> {
        const user = await this.userRepo.findOneBy({ id: dto.userId })
        user.email = dto.email
        user.username = dto.username
        user.password = dto.password
        user.salt = dto.salt
        await this.userRepo.save(user)
        return user
    }

    public async deleteUser({ userId }: DeleteUserDto): Promise<User> {
        const user: User = await this.userRepo.findOneBy({ id: userId })
        await this.userRepo.delete(user)
        return user
    }

}
