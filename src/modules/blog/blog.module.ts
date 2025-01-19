import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { BlogService } from "./services/blog.service";
import { BlogController } from "./controller/blog.controller";
import { AuthModule } from "../auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogEntity } from "./entities/blog.entity";
import { CategoryEntity } from "../category/entity/category.entity";
import { BlogCategoryEntity } from "./entities/blog-category.entity";
import { CategoryService } from "../category/category.service";
import { LikesEntity } from "./entities/like.entity";
import { BookmarkEntity } from "./entities/bookmark.entity";
import { commentService } from "./services/comments.service";
import { CommentEntity } from "./entities/comment.entity";
import { commentController } from "./controller/commetnts.controller";
import { AddUserToReqWOV } from "src/common/middleware/addUserToReqWOV.middleware";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      CategoryEntity,
      BlogCategoryEntity,
      LikesEntity,
      BookmarkEntity,
      CommentEntity,
    ]),
  ],
  controllers: [BlogController, commentController],
  providers: [BlogService, CategoryService, commentService],
})
export class BlogModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddUserToReqWOV).forRoutes("blog/by-slug/:slug");
  }
}
