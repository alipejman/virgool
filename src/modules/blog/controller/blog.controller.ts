import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CraeteBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { FilterBlog } from 'src/common/decorators/filter.decorator';
import { paginationsDto } from 'src/common/dtos/paginations.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { authDecorator } from 'src/common/decorators/auth.decorator';
import { SwaggerForm } from 'src/common/enums/swaggerForm.enum';
import { BlogService } from '../services/blog.service';

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

  
  @Get("/")
  @SkipAuth()
  @Pagination()
  @FilterBlog()
  find(@Query() paginationDto: paginationsDto, @Query() filterDto: FilterBlogDto) {
    return this.blogService.blogList(paginationDto, filterDto)
  }



  @Get("/by-slug/:slug")
  @SkipAuth()
  @Pagination()
  findOneBySlug(@Param('slug') slug: string, @Query() paginationDto: paginationsDto) {
    return this.blogService.findOneBySlug(slug, paginationDto)
  }

  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.delete(id)
  }
  @Put("/:id")
  @ApiConsumes(SwaggerForm.Urlencode, SwaggerForm.Json)
  update(@Param("id", ParseIntPipe) id: number, @Body() blogDto: UpdateBlogDto) {
    return this.blogService.update(id, blogDto)
  }


  @Get("/like/:id")
  likeToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.likeToggle(id)
  }

  @Get("/bookmark/:id")
  bookmarkToggle(@Param("id", ParseIntPipe) id: number) {
    return this.blogService.bookmarkToggle(id)
  }

  
}
