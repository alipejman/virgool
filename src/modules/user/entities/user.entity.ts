import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";
import { otpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
    @Column({ nullable: true, unique: true })
    username: string;

    @Column({ nullable: true, unique: true })
    phone: string;

    @Column({ nullable: true, unique: true })
    email: string;
    @Column({ nullable: true})
    password: string;

    @Column({ nullable: true })
    otpId: number;
    @Column({ nullable: true })
    profileId: number;

    @OneToOne(() => otpEntity, otp => otp.user, { nullable: true })
    @JoinColumn({ name: 'otpId' })
    otp: otpEntity;

    @OneToOne(() => ProfileEntity, profile => profile.user, { nullable: true })
    @JoinColumn({name: "profileId"}) // اینجا هم JoinColumn است
    profile: ProfileEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
