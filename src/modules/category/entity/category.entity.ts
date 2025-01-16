import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { BlogCategoryEntity } from "src/modules/blog/entities/blog-category.entity";
import { Column, CreateDateColumn, Entity, OneToMany, UpdateDateColumn } from "typeorm";

@Entity(EntityName.Category)
export class CategoryEntity extends BaseEntity{
    @Column()
    title: string;

    @Column({nullable: true})
    priority: number;

    @OneToMany(() => BlogCategoryEntity, blog => blog.category)
    blog_categories: BlogCategoryEntity[];
   
}