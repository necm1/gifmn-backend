import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Post} from '../entity/post.entity';
import {paginate, Paginated, PaginateQuery} from 'nestjs-paginate';

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
   * Paginate Posts
   *
   * @public
   * @param query
   * @returns Promise<Paginated<Post>>
   */
  public async paginatePosts(query: PaginateQuery): Promise<Paginated<Post>> {
    return paginate(query, this.postRepository, {
      sortableColumns: ['id'],
      defaultSortBy: [['id', 'DESC']],
      maxLimit: 35
    });
  }
}
