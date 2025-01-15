import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from "typeorm";
import { blogStatus } from "../enum/status.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { LikesEntity } from "./like.entity";
import { BookmarkEntity } from "./bookmark.entity";
import { CommentEntity } from "./comment.entity";

@Entity(EntityName.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  content: string;

  @Column()
  image: string;

  @Column()
  authorId: number;

  @Column({ default: blogStatus.draft })
  status: string;

  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: "CASCADE" })
  author: UserEntity;

  @OneToMany(() => LikesEntity, (blogLikes) => blogLikes.blog)
  likes: LikesEntity[];

  @OneToMany(() => BookmarkEntity, (blogBookmarks) => blogBookmarks.blog)
  bookmarks: BookmarkEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.blog)
  comments: CommentEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
