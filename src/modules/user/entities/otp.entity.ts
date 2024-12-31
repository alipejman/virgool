import { BaseEntity } from "src/common/abstract/base.entity";
import { Column, Entity, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { EntityName } from "src/common/enums/entity.enum";

@Entity(EntityName.Otp)
export class otpEntity extends BaseEntity{
    @Column()
    code: string;
    @Column()
    expiresIn: Date;
    @Column()
    userId: number;
    @OneToOne(() => UserEntity, User => User.otp, {onDelete: 'CASCADE'})
    user: UserEntity
}