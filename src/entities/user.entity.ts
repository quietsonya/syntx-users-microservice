import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'users' })
export class User {

    @PrimaryGeneratedColumn('uuid')
        id: string

    @Column({ type: 'varchar', length: 256, unique: true })
        email: string

    @Column({ type: 'varchar', length: 32, unique: true })
        username: string

    @Column({ type: 'char', length: 60 })
        password: string

    @Column({ type: 'varchar', length: 22 })
        salt: string

}