import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { CategoryEntity } from '../category/entity/category.entity';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { CategoryService } from '../category/category.service';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([
    BlogEntity,
    CategoryEntity,
    BlogCategoryEntity,
  ])],
  controllers: [BlogController],
  providers: [BlogService, CategoryService],
})
export class BlogModule {}
