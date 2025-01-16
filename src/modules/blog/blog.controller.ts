import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CraeteBlogDto, FilterBlogDto } from './dto/blog.dto';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { FilterBlog } from 'src/common/decorators/filter.decorator';
import { paginationsDto } from 'src/common/dtos/paginations.dto';
import { ApiTags } from '@nestjs/swagger';
import { authDecorator } from 'src/common/decorators/auth.decorator';

@Controller('blog')
@ApiTags("Blog")
@authDecorator()
export class BlogController {
  constructor(private readonly blogService: BlogService) {}




  @Post('/')
  create(@Body() blogDto: CraeteBlogDto) {
    return this.blogService.create(blogDto)
  }

  @Get("/my")
  myBlogs() {
    return this.blogService.myBlog()
  }

  
  // @Get("/")
  // @SkipAuth()
  // @Pagination()
  // @FilterBlog()
  // find(@Query() paginationDto: paginationsDto, @Query() filterDto: FilterBlogDto) {
  //   return this.blogService.blogList(paginationDto, filterDto)
  // }
}
