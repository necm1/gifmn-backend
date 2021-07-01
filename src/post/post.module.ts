import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {PostService} from './service/post.service';
import {Post} from './entity/post.entity';
import {PostTag} from './entity/post-tag.entity';
import {PostAttachment} from './entity/post-attachment.entity';
import {PostCategory} from './entity/post-category.entity';
import {PostController} from './controller/post.controller';
import {CategoryController} from './controller/category.controller';
import {CategoryService} from './service/category.service';
import {ResponseService} from '../_service/response.service';
import {AttachmentService} from './service/attachment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostTag, PostAttachment, PostCategory]),
  ],
  providers: [PostService, CategoryService, ResponseService, AttachmentService],
  exports: [TypeOrmModule, PostService],
  controllers: [PostController, CategoryController]
})
export class PostModule {
}
