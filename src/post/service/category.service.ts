import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Like, Repository} from 'typeorm';
import {PostCategory} from '../entity/post-category.entity';
import {CategoryNotFoundException} from '../exception/category-not-found.exception';
import {CategoryRepository} from '../repository/category.repository';
import {PostTag} from '../entity/post-tag.entity';

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
   * @param cacheManager
   */
  constructor(
    private categoryRepository: CategoryRepository,
    @Inject(CACHE_MANAGER)
    private cacheManager
  ) {
    this.categoryRepository.setProvider(cacheManager);
  }

  /**
   * @public
   * @async
   * @param id
   * @param name
   * @returns Promise<boolean>
   */
  public async update(id: number, name: string): Promise<boolean> {
    return (await this.categoryRepository.update(id, {name})).affected > 0;
  }

  /**
   * @public
   * @async
   * @param id
   */
  public async delete(id: number): Promise<boolean> {
    return (await this.categoryRepository.delete(id)).affected > 0;
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
      return [];
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
    const category: PostCategory = await this.categoryRepository.findOne({id});

    if (!category) {
      throw new CategoryNotFoundException(`Could not find category with ID: ${id}`);
    }

    return category;
  }

  /**
   * Create Category
   *
   * @public
   * @async
   * @param name
   * @returns Promise<PostCategory>
   */
  public async create(name: string): Promise<PostCategory> {
    const entity = this.categoryRepository.create();
    entity.name = name;

    return this.categoryRepository.save<PostCategory>(entity);
  }
}
