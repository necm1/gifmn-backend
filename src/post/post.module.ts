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
import {UserModule} from '../user/user.module';
import {AttachmentRepository} from './repository/attachment.repository';
import { AttachmentController } from './controller/attachment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      PostRepository,
      PostTag,
      TagRepository,
      PostAttachment,
      AttachmentRepository,
      PostCategory,
      CategoryRepository
    ]),
    UserModule
  ],
  providers: [PostService, CategoryService, ResponseService, AttachmentService, TagService, UploadService],
  exports: [TypeOrmModule, PostService],
  controllers: [PostController, CategoryController, TagController, AttachmentController]
})
export class PostModule {
}
