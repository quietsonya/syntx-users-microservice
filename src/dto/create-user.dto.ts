import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'

export class CreateUserDto {

    @IsEmail()
        email: string

    @IsString()
        username: string

    @IsString()
    @MinLength(6)
    @MaxLength(32)
        password: string

    @IsString()
    @MaxLength(60)
        salt: string

}