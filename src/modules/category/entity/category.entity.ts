import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity{
    @Column()
    title: string;

    @Column({nullable: true})
    priority: number;
   
}