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
import {TagController} from './controller/tag.controller';
import {TagService} from './service/tag.service';
import {TagRepository} from './repository/tag.repository';
import {CategoryRepository} from './repository/category.repository';
import {PostRepository} from './repository/post.repository';
import {UploadService} from './service/upload.service';
import {UserService} from '../user/service/user.service';
import {CacheModule} from '../cache/cache.module';
import {UserModule} from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostRepository,
      PostTag,
      TagRepository,
      PostAttachment,
      PostCategory,
      CategoryRepository
    ]),
    UserModule
  ],
  providers: [PostService, CategoryService, ResponseService, AttachmentService, TagService, UploadService],
  exports: [TypeOrmModule, PostService],
  controllers: [PostController, CategoryController, TagController]
})
export class PostModule {
}
