import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntityName.BlogBookmarks)
export class BookmarkEntity extends BaseEntity {
    @Column()
    blogId: number;

    @Column()
    userId: number;

    @ManyToOne(() => UserEntity, user => user.blogBookmarks, { onDelete: "CASCADE" })
    user: UserEntity;

    @ManyToOne(() => BlogEntity, blog => blog.bookmarks, { onDelete: "CASCADE" })
    blog: BlogEntity;
}
