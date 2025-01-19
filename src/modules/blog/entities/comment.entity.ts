import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from "typeorm";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { BlogEntity } from "./blog.entity";

@Entity(EntityName.BlogComments)
export class CommentEntity extends BaseEntity {
    @Column()
    text: string;

    @Column({default: false})
    accepted: boolean

    @Column()
    userId: number;

    @Column()
    blogId: number;

    @Column({nullable: true})
    parentId: number

    @ManyToOne(() => UserEntity, user => user.comments, { onDelete: "CASCADE" })
    user: UserEntity;

    @ManyToOne(() => BlogEntity, blog => blog.comments, { onDelete: "CASCADE" })
    blog: BlogEntity;

    @ManyToOne(() => CommentEntity, parent => parent.children, {onDelete: "CASCADE"})
    parent: CommentEntity
    
    @OneToMany(() => CommentEntity, comment => comment.parent)
    @JoinColumn({ name: "parent" })
    children: CommentEntity[]

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
