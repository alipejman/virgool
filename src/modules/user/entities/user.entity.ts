import { BaseEntity } from "src/common/abstract/base.entity";
import { EntityName } from "src/common/enums/entity.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from "typeorm";
import { otpEntity } from "./otp.entity";
import { ProfileEntity } from "./profile.entity";
import { BlogEntity } from "src/modules/blog/entities/blog.entity";
import { LikesEntity } from "src/modules/blog/entities/like.entity";
import { BookmarkEntity } from "src/modules/blog/entities/bookmark.entity";
import { CommentEntity } from "src/modules/blog/entities/comment.entity";
import { Roles } from "src/modules/auth/enums/role.enum";
import { FollowEntity } from "./follow.entity";

@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ nullable: true, unique: true })
  username: string;

  @Column({ nullable: true, unique: true })
  phone: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ default: Roles.User })
  role: string;

  @Column({ nullable: true })
  newEmail: string;

  @Column({ nullable: true })
  newPhone: string;

  @Column({ nullable: true, default: false })
  verifyEmail: boolean;

  @Column({ nullable: true, default: false })
  verifyPhone: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  otpId: number;

  @Column({ nullable: true })
  profileId: number;

  @OneToMany(() => BlogEntity, (blog) => blog.author)
  blogs: BlogEntity[];

  @OneToMany(() => LikesEntity, (blogLikes) => blogLikes.user)
  blogLikes: LikesEntity[];

  @OneToMany(() => BookmarkEntity, (blogBookmarks) => blogBookmarks.user)
  blogBookmarks: BookmarkEntity[];

  @OneToMany(() => CommentEntity, (comment) => comment.user)
  comments: CommentEntity[];

  @OneToOne(() => otpEntity, (otp) => otp.user, { nullable: true })
  @JoinColumn({ name: "otpId" })
  otp: otpEntity;

  @OneToOne(() => ProfileEntity, (profile) => profile.user, { nullable: true })
  @JoinColumn({ name: "profileId" })
  profile: ProfileEntity;

  @OneToMany(() => FollowEntity, (follow) => follow.following)
  followers: FollowEntity[];

  @OneToMany(() => FollowEntity, (follow) => follow.follower)
  following: FollowEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
