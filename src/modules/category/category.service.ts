import { ConflictException, Injectable } from "@nestjs/common";
import { CreateCategoryDto } from "./dto/createCategoryDto";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "./entity/category.entity";
import { Repository } from "typeorm";
import { CategoryMessage } from "src/common/enums/messages.enum";
import { paginationsDto } from "src/common/dtos/paginations.dto";
import {
  paginationGenerator,
  paginationSolver,
} from "src/common/utils/pagination.solver";
import { Pagination } from "src/common/decorators/pagination.decorator";
import { updateCategoryDto } from "./dto/updateCategoryDto";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>
  ) {}

  // Check if category exist by title
  async checkExistCategoryByTitle(title: string) {
    title = title?.trim()?.toLocaleLowerCase();
    const category = await this.categoryRepository.findOneBy({ title });
    if (category) throw new ConflictException(CategoryMessage.exist);
    return title;
  }

  // Create category
  async craeteCategory(createCategoryDto: CreateCategoryDto) {
    let { priority, title } = createCategoryDto;
    title = await this.checkExistCategoryByTitle(title);
    const category = this.categoryRepository.create({ priority, title });
    await this.categoryRepository.save(category);
    return { message: CategoryMessage.created };
  }

  // Get all categories
  async findAll(paginationsDto: paginationsDto) {
    try {
      const { page, limit, skip } = paginationSolver(paginationsDto);
      
      const [categories, count] = await this.categoryRepository.findAndCount({
        where: {},
        order: { priority: 'ASC' }, // مرتب‌سازی بر اساس اولویت
        skip,
        take: limit,
      });
      
      return {
        Pagination: paginationGenerator(count, page, limit),
        data: categories,
      };
    } catch (error) {
      // مدیریت خطا
      return {
        message: 'Error fetching categories',
        error: error.message,
      };
    }
  }
  

  // Get category by id
  async findById(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new ConflictException(CategoryMessage.notFound);
    return category;
  }

  // Update category by id
  async updateCategory(id: number, updateCategoryDto: updateCategoryDto) {
    let { priority, title } = updateCategoryDto;
    title = await this.checkExistCategoryByTitle(title);
    const category = await this.findById(id);
    category.priority = priority;
    category.title = title;
    await this.categoryRepository.save(category);
    return { message: CategoryMessage.updated };
  }


  // Delete category by id
  async deleteCategory(id: number) {
    const category = await this.findById(id);
    await this.categoryRepository.remove(category);
    return { message: CategoryMessage.deleted };
  }
} 
