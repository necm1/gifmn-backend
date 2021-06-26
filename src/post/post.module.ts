import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PostService} from './service/post.service';
import {Post} from './entity/post.entity';
import {PostTag} from './entity/post-tag.entity';
import {PostAttachment} from './entity/post-attachment.entity';
import {PostController} from './controller/post.controller';
import {PostsController} from './controller/posts.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostTag, PostAttachment]),
  ],
  providers: [PostService],
  exports: [TypeOrmModule, PostService],
  controllers: [PostController, PostsController]
})
export class PostModule {
}
