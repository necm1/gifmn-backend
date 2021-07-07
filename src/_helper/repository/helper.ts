import {DeleteResult, Repository as TypeRepository} from 'typeorm';
import {environment} from '../../environment';

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
   * @param args
   * @returns Promise<T>
   */
  public async findOne(...args: any[]): Promise<T> {
    const value = this.$provider.get(`${this.cachePrefix}`);
    let cacheable = args[args.length - 1];

    if (typeof cacheable === 'boolean') {
      cacheable = args.pop();
    }

    if (
      environment.cache.use &&
      cacheable &&
      value
    ) {
      return value;
    }

    return super.findOne(...args);
  }

  /**
   * @public
   * @param args
   * @returns Promise<DeleteResult>
   */
  public async delete(...args: any[]): Promise<DeleteResult> {
    const value = this.$provider.get(`${this.cachePrefix}`);

    if (
      environment.cache.use &&
      value
    ) {
      this.$provider.del(`${this.cachePrefix}`);
    }

    return super.delete(args);
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
