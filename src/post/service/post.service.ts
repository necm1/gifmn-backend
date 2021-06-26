import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Post} from '../entity/post.entity';

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
}
