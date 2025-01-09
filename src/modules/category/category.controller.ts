import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { ApiConsumes, ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateCategoryDto } from "./dto/createCategoryDto";
import { SwaggerForm } from "src/common/enums/swaggerForm.enum";
import { paginationsDto } from "src/common/dtos/paginations.dto";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { paginationSolver } from "src/common/utils/pagination.solver";
import { updateCategoryDto } from "./dto/updateCategoryDto";

@Controller("category")
@ApiTags("Category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}


  // Create category 
  @ApiConsumes(SwaggerForm.Urlencode, SwaggerForm.Json)
  @Post()
  createCategory(@Body() CreateCategoryDto: CreateCategoryDto) {
    try {
      return this.categoryService.craeteCategory(CreateCategoryDto);
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }


  // Get all categories
  @Get()
  @Pagination()
  findAll(@Query() paginationsDto: paginationsDto) {
   return this.categoryService.findAll(paginationsDto); 
  }


  @Patch(":id")
  @ApiConsumes(SwaggerForm.Urlencode, SwaggerForm.Json)
  updateCategory(@Param("id",ParseIntPipe) id: number, @Body() updateCategoryDto: updateCategoryDto) {
    try {
      return this.categoryService.updateCategory(id, updateCategoryDto);
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }


  @Delete(":id")
  deleteCategory(@Param("id",ParseIntPipe) id: number) {
    try {
      return this.categoryService.deleteCategory(id);
    } catch (error) {
      return {
        message: error.message,
      };
    }
  }
  
}
