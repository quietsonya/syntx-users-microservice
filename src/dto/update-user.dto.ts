import { IsEmail, IsString, MinLength, MaxLength, IsUUID } from 'class-validator'

export class UpdateUserDto {

    @IsUUID()
        userId: string

    @IsEmail()
        email?: string

    @IsString()
        username?: string

    @IsString()
    @MinLength(6)
    @MaxLength(32)
        password?: string

    @IsString()
    @MaxLength(60)
        salt?: string

}