import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Post} from '../entity/post.entity';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';
import {PostAttachment} from '../entity/post-attachment.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {
  }

  findAll(): Promise<Post[]> {
    return this.postRepository.find({relations: ['user', 'tags', 'attachments']});
  }

  /**
   * @public
   * @param id
   * @param options
   */
  public async paginateCategoryPosts(id: number, options: IPaginationOptions): Promise<Pagination<Post>> {
    const queryBuilder = this.postRepository.createQueryBuilder('paginatePosts');
    queryBuilder
      .where('paginatePosts.category_id = :id', {id})
      .leftJoinAndSelect('paginatePosts.attachments', 'attachments')
      .leftJoinAndSelect('paginatePosts.tags', 'tags')
      .orderBy('paginatePosts.id', 'DESC');

    return paginate<Post>(queryBuilder, options);
  }

  /**
   * Paginate Posts
   *
   * @public
   * @param options
   * @returns Promise<Paginated<Post>>
   */
  public async paginatePosts(options: IPaginationOptions): Promise<Pagination<Post>> {
    return paginate<Post>(this.postRepository, options);
  }
}
