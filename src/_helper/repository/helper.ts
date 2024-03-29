import {
  DeleteResult,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
  ObjectID,
  Repository as TypeRepository
} from 'typeorm';
import {environment} from '../../environment';
import {IPaginationOptions} from 'nestjs-typeorm-paginate/dist/interfaces';
import {Pagination} from 'nestjs-typeorm-paginate/dist/pagination';
import {paginate} from 'nestjs-typeorm-paginate';
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity';
import {UpdateResult} from 'typeorm/query-builder/result/UpdateResult';
import {SaveOptions} from 'typeorm/repository/SaveOptions';
import {DeepPartial} from 'typeorm/common/DeepPartial';

/**
 * @class Repository
 * @extends TypeRepository
 */
export abstract class Repository<T> extends TypeRepository<T> {
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
   * @protected
   * @property
   */
  protected cacheTTL: number;

  /**
   * @private
   * @property
   */
  private $provider: any;

  /**
   * @private
   * @property
   */
  private primaryColumn: string;

  /**
   * Repository Constructor
   *
   * @constructor
   */
  public constructor() {
    super();

    setTimeout(() => this.primaryColumn = this.metadata?.columns?.filter(column => column.isPrimary)[0]?.propertyName, 1000);
  }

  /**
   * @public
   * @param conditions
   * @param options
   * @param force
   * @returns Promise<T>
   */
  public async findOne(conditions?: FindConditions<T> | FindOneOptions<T>, options?: FindOneOptions<T> | {force: boolean}): Promise<T> {
    let isFindConditions = true;

    if (typeof conditions === 'object' && ('where' in conditions || 'select' in conditions)) {
      isFindConditions = false;
    }

    const cacheName = isFindConditions ? Object.values(conditions)[0] : JSON.stringify(conditions);
    let entity = await this.getCache(cacheName)

    let forceInObj = false;
    let force = false;

    if (options && 'force' in options) {
      forceInObj = true;
      force = options.force;
    }

    if (!force && entity) {
      return entity;
    }

    // Get Entity From Database
    entity = await super.findOne(conditions, !forceInObj ? options as FindOneOptions<T> : {});

    if (entity) {
      await this.setCache(cacheName, entity);
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
    force = false,
    searchOptions?: FindConditions<T> | FindManyOptions<T> | {force: boolean},
  ): Promise<Pagination<T, any>> {
    const cacheName = `${searchOptions ? JSON.stringify(searchOptions) : ''}`;
    let entity = await this.getCache(cacheName);

    if (!force && entity) {
      return entity;
    }

    entity = await paginate(this, options, searchOptions);

    if (entity) {
      await this.setCache(cacheName, entity);
    }

    return entity;
  }

  /**
   * @public
   * @param criteria
   * @param partialEntity
   */
  public async update(
    criteria: (string | number | FindConditions<T>),
    partialEntity: QueryDeepPartialEntity<T>
  ): Promise<UpdateResult> {
    const result = await super.update(criteria, partialEntity);

    const cacheName: string = typeof criteria === 'string' ? criteria :
      typeof criteria === 'number' ? criteria.toString()
        : Object.values(criteria)[0] as string;

    const entity = await this.getCache(cacheName);

    if (entity) {
      // Delete from Cache
      await this.deleteCache(cacheName);
    }

    // Add to Cache
    await this.findOne(criteria);

    return result;
  }

  /**
   * Save Entity
   *
   * @public
   * @async
   * @param entity
   * @param options
   * @returns J
   */
  public async save<J extends DeepPartial<T>>(entity: J, options?: SaveOptions): Promise<J> {
    const result = await super.save(entity, options);

    const cacheEntity = await this.getCache(result[this.primaryColumn]);

    if (cacheEntity) {
      // Delete from Cache
      await this.deleteCache(result[this.primaryColumn]);
    }

    // Add to Cache
    await this.findOne({[this.primaryColumn]: result[this.primaryColumn]});

    return result;
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
      await this.deleteCache(entity);
    }

    return super.delete(conditions);
  }

  /**
   * @param key
   * @private
   */
  private async getCache(key: string): Promise<any> {
    if (!environment.cache.use) {
      return undefined;
    }

    return this.$provider.get(`${this.cachePrefix}${key}`);
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

    return this.$provider.set(`${this.cachePrefix}${key}`, value, {
      ttl: this.cacheTTL ?? environment.cache.ttl
    });
  }

  /**
   * @private
   * @async
   * @param key
   */
  private async deleteCache(key: string): Promise<void> {
    if (!this.$provider || !environment.cache.use) {
      return;
    }

    await this.$provider.del(`${this.cachePrefix}${key}`);
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
