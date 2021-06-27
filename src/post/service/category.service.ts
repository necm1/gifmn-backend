import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PostCategory} from '../entity/post-category.entity';
import {CategoryNotFoundException} from '../exception/category-not-found.exception';

@Injectable()
/**
 * @class CategoryService
 */
export class CategoryService {
  /**
   * CategoryService Constructor
   *
   * @constructor
   * @param categoryRepository
   */
  constructor(
    @InjectRepository(PostCategory)
    private categoryRepository: Repository<PostCategory>
  ) {
  }

  /**
   * Get All Categories
   *
   * @public
   * @async
   * @returns Promise<PostCategory[]>
   */
  public async all(): Promise<PostCategory[]> {
    const categories: PostCategory[] = await this.categoryRepository.find();

    if (categories.length === 0) {

    }

    return categories;
  }

  /**
   * Get PostCategory
   *
   * @public
   * @async
   * @param id
   * @returns Promise<PostCategory>
   */
  public async get(id: number): Promise<PostCategory> {
    const category: PostCategory = await this.categoryRepository.findOne(id);

    if (!category) {
      throw new CategoryNotFoundException(`Could not find category with ID: ${id}`);
    }

    return category;
  }
}
