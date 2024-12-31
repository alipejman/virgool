import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity(EntityName.Profile)
export class ProfileEntity extends BaseEntity {
    // Other properties of the entity
    @Column()
    firstName: string;
    @Column({nullable:true})
    lastName: string;
    @Column({nullable:true})
    bio: string;
    @Column({nullable:true})
    avatar: string;
    @Column({nullable:true})
    age: number;
    @Column({nullable:true})
    birthday: Date;
    @Column({nullable:true})
    linkedin: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;

}