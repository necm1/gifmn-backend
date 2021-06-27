import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Post} from '../entity/post.entity';
import {IPaginationOptions, paginate, Pagination} from 'nestjs-typeorm-paginate';

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
   * @param options
   * @returns Promise<Paginated<Post>>
   */
  public async paginatePosts(options: IPaginationOptions): Promise<Pagination<Post>> {
    return paginate<Post>(this.postRepository, options);
  }
}
