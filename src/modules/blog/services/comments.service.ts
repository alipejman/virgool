import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { InjectRepository } from "@nestjs/typeorm";
import { Request } from "express";
import { BlogEntity } from "../entities/blog.entity";
import { IsNull, Repository } from "typeorm";
import { CommentEntity } from "../entities/comment.entity";
import { createCommentDto } from "../dto/comments.dto";
import { BlogService } from "./blog.service";
import { BlogMessage, publicMessage } from "src/common/enums/messages.enum";
import { paginationsDto } from "src/common/dtos/paginations.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utils/pagination.solver";

@Injectable({ scope: Scope.REQUEST })
export class commentService {
  constructor(
    @Inject(REQUEST) private request: Request,
    @InjectRepository(BlogEntity)
    private blogRepositort: Repository<BlogEntity>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
    @Inject(forwardRef(() => BlogService)) private blogService: BlogService
  ) {}

  async createComment(commentDto: createCommentDto) {
    const { blogId, parentId, text } = commentDto;
    const { id: userId } = this.request.user;
    const blog = await this.blogService.checkExistBlogById(blogId);
    let parent = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.commentRepository.findOneBy({ id: +parentId });
    }

    await this.commentRepository.insert({
      text,
      accepted: false,
      blogId,
      parentId: parent ? parentId : null,
      userId,
    });
    return {
      message: BlogMessage.commentCreate,
    };
  }

  async find(paginationDto: paginationsDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [comments, count] = await this.commentRepository.findAndCount({
      where: {},
      relations: {
        blog: true,
        user: { profile: true },
      },
      select: {
        blog: {
          title: true,
        },
        user: {
          username: true,
          profile: {
            firstName: true,
          },
        },
      },
      skip,
      take: limit,
      order: { id: "DESC" },
    });
    return {
      pagination: paginationGenerator(count, page, limit),
      comments,
    };
  }

  async checkExistById(id: number) {
    const comment = await this.commentRepository.findOneBy({ id });
    if (!comment) throw new NotFoundException(publicMessage.somthinWrong);
    return comment;
}

  async accept(id: number) {
    const comment = await this.checkExistById(id);
    if(comment.accepted) throw new BadRequestException(BlogMessage.acceptedAlready);
    comment.accepted = true
    await this.commentRepository.save(comment);
    return {
      message: BlogMessage.acceptedComment
    }
  }

  async reject(id: number) {
    const comment = await this.checkExistById(id);
    if(!comment.accepted) throw new BadRequestException(BlogMessage.rejectedAlready)
    comment.accepted = false;
    await this.commentRepository.save(comment);
    return {
      message: BlogMessage.rejectedComment
    }
  }


  async findCommentsOfBlog(blogId: number, paginationDto: paginationsDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [comments, count] = await this.commentRepository.findAndCount({
        where: {
            blogId,
            parentId: IsNull()
        },
        relations: {
            user: { profile: true },
            children: {
                user: { profile: true },
                children: {
                    user: { profile: true },
                }
            }
        },
        select: {
            user: {
                username: true,
                profile: {
                    firstName: true
                }
            },
            children: {
                text: true,
                createdAt: true,
                parentId: true,
                user: {
                    username: true,
                    profile: {
                      firstName: true
                    }
                },
                children: {
                    text: true,
                    createdAt: true,
                    parentId: true,
                    user: {
                        username: true,
                        profile: {
                          firstName: true
                        }
                    },
                }
            }
        },
        skip,
        take: limit,
        order: { id: "DESC" }
    });
    return {
        pagination: paginationGenerator(count, page, limit),
        comments
    }
}
}
