import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CraeteBlogDto } from './dto/blog.dto';
import { createSlug, randomId } from 'src/common/utils/functions.util';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { CategoryService } from '../category/category.service';
import { isArray } from 'class-validator';
import { blogStatus } from './enum/status.enum';
import { BlogMessage, CategoryMessage } from 'src/common/enums/messages.enum';

@Injectable({scope: Scope.REQUEST})
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCategoryEntity) private blogCategoryRepository: Repository<BlogCategoryEntity>,
        @Inject(REQUEST) private request: Request,
        private categoryService: CategoryService,

    ) {}


    async create(blogDto: CraeteBlogDto) {
        const user = this.request.user;
        let { title, slug, content, description, image, time_for_study, categories } = blogDto;
        if (!isArray(categories) && typeof categories === "string") {
            categories = categories.split(",")
        } else if (!isArray(categories)) {
            throw new BadRequestException(CategoryMessage.isnottrue)
        }
        let slugData = slug ?? title;
        slug = createSlug(slugData);
        const isExist = await this.checkBlogBySlug(slug);
        if (isExist) {
            slug += `-${randomId()}`
        }
        let blog = this.blogRepository.create({
            title,
            slug,
            description,
            content,
            image,
            status: blogStatus.draft,
            time_for_study,
            authorId: user.id,
        });
        blog = await this.blogRepository.save(blog);
        for (const categoryTitle of categories) {
            let category = await this.categoryService.findOneByTitle(categoryTitle)
            if (!category) {
                category = await this.categoryService.insertByTitle(categoryTitle)
            }
            await this.blogCategoryRepository.insert({
                blogId: blog.id,
                categoryId: category.id
            });
        }
        return {
            message: BlogMessage.created
        }
    }

    async checkBlogBySlug(slug: string) {
        const blog = await this.blogRepository.findOneBy({ slug });
        return blog
    }

    async myBlog() {
        const { id } = this.request.user;
        return this.blogRepository.find({
            where: {
                authorId: id
            },
            order: {
                id: "DESC"
            }
        })
    }
}
