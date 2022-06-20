import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator'

export class CreateUserDto {

    @IsEmail()
        email: string

    @IsString()
        username: string

    @IsString()
    @MinLength(6)
    @MaxLength(60)
        password: string

    @IsString()
    @MaxLength(2)
        salt: string

}