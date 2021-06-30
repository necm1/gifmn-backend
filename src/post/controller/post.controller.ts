import {Controller} from '@nestjs/common';
import {PostService} from '../service/post.service';

@Controller()
export class PostController {
  constructor(private postService: PostService) {
  }


}
