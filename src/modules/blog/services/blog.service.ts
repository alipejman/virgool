import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { DataSource, Repository } from 'typeorm';
import { CraeteBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { createSlug, randomId } from 'src/common/utils/functions.util';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { CategoryService } from '../../category/category.service';
import { isArray } from 'class-validator';
import { blogStatus } from '../enum/status.enum';
import { BlogMessage, CategoryMessage } from 'src/common/enums/messages.enum';
import { paginationsDto } from 'src/common/dtos/paginations.dto';
import { paginationGenerator, paginationSolver } from 'src/common/utils/pagination.solver';
import { EntityName } from 'src/common/enums/entity.enum';
import { LikesEntity } from '../entities/like.entity';
import { BookmarkEntity } from '../entities/bookmark.entity';
import { commentService } from './comments.service';

@Injectable({scope: Scope.REQUEST})
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepository: Repository<BlogEntity>,
        @InjectRepository(BlogCategoryEntity) private blogCategoryRepository: Repository<BlogCategoryEntity>,
        @InjectRepository(LikesEntity) private blogLikeRepository: Repository<LikesEntity>,
        @InjectRepository(BookmarkEntity) private blogBookmarkRepository: Repository<BookmarkEntity>,
        @Inject(REQUEST) private request: Request,
        private categoryService: CategoryService,
        private commentService : commentService,
        private dataSource: DataSource
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

    async blogList(paginationDto: paginationsDto, filterDto: FilterBlogDto) {
       const { limit, page, skip} = paginationSolver(paginationDto);
       let { category, search} = filterDto;
       let where = '';
       if(category) {
        category = category.toLowerCase();
        if(where.length > 0) where += ' AND '
        where += 'category.title = LOWER(:category)'
       }
       if(search) {
        if(where.length > 0) where += ' AND '
        where += 'CONCAT(blog.title, blog.description, blog.content) ILIKE :search'
       }

       const [blogs, count] = await this.blogRepository.createQueryBuilder(EntityName.Blog)
       .leftJoin("Blog.categories", "categories")
            .leftJoin("categories.category", "category")
            .leftJoin("Blog.author", "author")
            .leftJoin("author.profile", "profile")
            .addSelect(['categories.id', 'category.title', 'author.username', 'author.id', 'profile.firstName'])
            .where(where, { category, search })
            .loadRelationCountAndMap("Blog.likes", "Blog.likes")
            .loadRelationCountAndMap("Blog.bookmarks", "Blog.bookmarks")
            .loadRelationCountAndMap('Blog.comments', 'Blog.comments', 'comments', (qb) => 
            qb.where('comments.accepted = :accepted', {accepted: true})
            )
            .orderBy("Blog.id", 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();


            return {
                pagination: paginationGenerator(count, page, limit),
                blogs,
            }
    }

    async checkExistBlogById(id: number) {
        const blog = await this.blogRepository.findOneBy({ id });
        if (!blog) throw new NotFoundException(BlogMessage.notFound);
        return blog
    }
    async delete(id: number) {
        await this.checkExistBlogById(id);
        await this.blogRepository.delete({ id })
        return {
            message: BlogMessage.delete
        }
    }
    async update(id: number, blogDto: UpdateBlogDto) {
        const user = this.request.user;
        let { title, slug, content, description, image, time_for_study, categories } = blogDto;
        const blog = await this.checkExistBlogById(id)
        if (!isArray(categories) && typeof categories === "string") {
            categories = categories.split(",")
        } else if (!isArray(categories)) {
            throw new BadRequestException(CategoryMessage.isnottrue)
        }
        let slugData = null;
        if (title) {
            slugData = title;
            blog.title = title;
        }
        if (slug) slugData = slug;

        if (slugData) {
            slug = createSlug(slugData);
            const isExist = await this.checkBlogBySlug(slug);
            if (isExist && isExist.id !== id) {
                slug += `-${randomId()}`
            }
            blog.slug = slug;
        }
        if (description) blog.description = description;
        if (content) blog.content = content;
        if (image) blog.image = image;
        if (time_for_study) blog.time_for_study = time_for_study;
        await this.blogRepository.save(blog);
        if (categories && isArray(categories) && categories.length > 0) {
            await this.blogCategoryRepository.delete({ blogId: blog.id });
        }
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
            message: BlogMessage.updated
        }
    }



    async likeToggle(blogId: number) {
        const { id: userId } = this.request.user;
        const blog = await this.checkExistBlogById(blogId);
        const isLiked = await this.blogLikeRepository.findOneBy({ userId, blogId });
        let message = BlogMessage.liked;
        if (isLiked) {
            await this.blogLikeRepository.delete({ id: isLiked.id });
            message = BlogMessage.notLike
        } else {
            await this.blogLikeRepository.insert({
                blogId, userId
            })
        }
        return { message }
    }

    async bookmarkToggle(blogId: number) {
        const { id: userId } = this.request.user;
        const blog = await this.checkExistBlogById(blogId);
        const isBookmarked = await this.blogBookmarkRepository.findOneBy({ userId, blogId });
        let message = BlogMessage.bookmark;
        if (isBookmarked) {
            await this.blogBookmarkRepository.delete({ id: isBookmarked.id });
            message = BlogMessage.notBookmark
        } else {
            await this.blogBookmarkRepository.insert({
                blogId, userId
            })
        }
        return { message }
    }



    async findOneBySlug(slug: string, paginationDto: paginationsDto) {
        const userId = this.request?.user?.id;
        const blog = await this.blogRepository.createQueryBuilder(EntityName.Blog)
            .leftJoin("Blog.categories", "categories")
            .leftJoin("categories.category", "category")
            .leftJoin("Blog.author", "author")
            .leftJoin("author.profile", "profile")
            .addSelect([
                'categories.id',
                'category.title',
                'author.username',
                'author.id',
                'profile.nick_name'
            ])
            .where({ slug })
            .loadRelationCountAndMap("Blog.likes", "Blog.likes")
            .loadRelationCountAndMap("Blog.bookmarks", "Blog.bookmarks")
            .getOne();
        if (!blog) throw new NotFoundException(BlogMessage.NotFound);
        const commentsData = await this.commentService.findCommentsOfBlog(blog.id, paginationDto)
        let isLiked = false;
        let isBookmarked = false;
        if (userId && !isNaN(userId) && userId > 0) {
            isLiked = !!(await this.blogLikeRepository.findOneBy({ userId, blogId: blog.id }))
            isBookmarked = !!(await this.blogBookmarkRepository.findOneBy({ userId, blogId: blog.id }))
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        const suggestBlogs = await queryRunner.query(`
            WITH suggested_blogs AS (
                SELECT 
                    Blog.id,
                    Blog.slug,
                    Blog.title,
                    Blog.description,
                    Blog.time_for_study,
                    Blog.image,
                    json_build_object(
                        'username', u.username,
                        'author_name', p.nick_name,
                        'image', p.image_profile
                    ) AS author,
                    array_agg(DISTINCT cat.title) AS categories,
                    (
                        SELECT COUNT(*) FROM blog_likes
                        WHERE blog_likes."blogId" = blog.id
                    ) AS likes,
                    (
                        SELECT COUNT(*) FROM blog_bookmarks
                        WHERE blog_bookmarks."blogId" = blog.id
                    ) AS bookmarks,
                    (
                        SELECT COUNT(*) FROM blog_comments
                        WHERE blog_comments."blogId" = blog.id
                    ) AS comments
                FROM blog
                LEFT JOIN public.user u ON blog."authorId" = u.id
                LEFT JOIN profile p ON p."userId" = u.id
                LEFT JOIN blog_category bc ON blog.id = bc."blogId"
                LEFT JOIN category cat ON bc."categoryId" = cat.id
                GROUP BY blog.id, u.username, p.nick_name, p.image_profile
                ORDER BY RANDOM()
                LIMIT 3

            )
            SELECT * FROM suggested_blogs
        `);
        return {
            blog,
            isLiked,
            isBookmarked,
            commentsData,
            suggestBlogs
        }
    }


}
