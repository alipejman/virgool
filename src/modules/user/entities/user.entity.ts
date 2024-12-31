import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";
import { otpEntity } from "./otp.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
    // Other properties of the entity
    @Column({nullable:true , unique: true})
    username: string;
    @Column({nullable:true, unique: true})
    phone: string;
    @Column({nullable:true, unique: true})
    email: string;
    @Column({nullable:true})
    otpId: number;
    @OneToOne(() => otpEntity, otp => otp.user, {nullable:true})
    otp: otpEntity;
    @JoinColumn({name: 'otpId'})
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;

}
