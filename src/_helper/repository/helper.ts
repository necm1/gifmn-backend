import {
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  ObjectID,
  Repository as TypeRepository
} from 'typeorm';
import {environment} from '../../environment';
import {createHash} from 'crypto';
import {IPaginationOptions} from 'nestjs-typeorm-paginate/dist/interfaces';
import {Pagination} from 'nestjs-typeorm-paginate/dist/pagination';
import {paginate} from 'nestjs-typeorm-paginate';

/**
 * @class Repository
 * @extends TypeRepository
 */
export abstract class Repository<T> extends TypeRepository<T> {
  /**
   * @protected
   * @property
   */
  protected $provider: any;

  /**
   * @protected
   * @property
   */
  protected cachePrefix: string;

  /**
   * @protected
   * @property
   */
  protected cacheCollectionPrefix: string;

  /**
   * @public
   * @param conditions
   * @param options
   * @returns Promise<T>
   */
  public async findOne(conditions?: (FindConditions<T> | FindOneOptions<T>), options?: FindOneOptions<T>): Promise<T> {
    let entity = await this.getCache(JSON.stringify(conditions));

    if (entity) {
      return entity;
    }

    // Get Entity From Database
    entity = await super.findOne(conditions, options);

    if (entity) {
      await this.setCache(await this.getCacheKey(`${this.cachePrefix}${JSON.stringify(conditions)}`), entity);
    }

    return entity;
  }

  /**
   * @public
   * @param options
   * @param searchOptions
   * @returns Promise<Pagination<T, any>>
   */
  public async list(
    options: IPaginationOptions<any>,
    searchOptions?: FindConditions<T> | FindManyOptions<T>
  ): Promise<Pagination<T, any>> {
    let entity = await this.getCache(
      `${JSON.stringify(options)}${searchOptions ? '_' + JSON.stringify(searchOptions) : ''}`
    );

    if (entity) {
      return entity;
    }

    entity = await paginate(this, options, searchOptions);

    if (entity) {
      await this.setCache(await this.getCacheKey(`${this.cachePrefix}${JSON.stringify(options)}${searchOptions ? '_' + JSON.stringify(searchOptions) : ''}`), entity);
    }

    return entity;
  }



  /**
   * @public
   * @returns Promise<DeleteResult>
   * @param conditions
   */
  public async delete(
    conditions: (string | number | Date | ObjectID | string[] | number[] | Date[] | ObjectID[] | FindConditions<T>)
  ): Promise<DeleteResult> {
    const entity = await this.getCache(JSON.stringify(conditions));

    if (entity) {
      await this.$provider.del(await this.getCacheKey(`${this.cachePrefix}${entity}
`));
    }

    return super.delete(conditions);
  }

  /**
   * @private
   * @param serializedEntity
   */
  private async getCacheKey(serializedEntity: string): Promise<string> {
    return createHash('sha256').update(JSON.stringify(serializedEntity)).digest('hex');
  }

  /**
   * @param key
   * @private
   */
  private async getCache(key: string): Promise<any> {
    if (!environment.cache.use) {
      return undefined;
    }

    return this.$provider.get(await this.getCacheKey(`${this.cachePrefix}${key}
`));
  }

  /**
   * @private
   * @param key
   * @param value
   * @returns Promise<void>
   */
  private async setCache(key: string, value: any): Promise<void> {
    if (!this.$provider || !environment.cache.use) {
      return;
    }

    return this.$provider.set(key, value);
  }

  /**
   * Set Provider
   *
   * @public
   * @param provider
   */
  public setProvider(provider: any): void {
    this.$provider = provider;
  }
}
