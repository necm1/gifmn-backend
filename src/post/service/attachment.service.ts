import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PostAttachment} from '../entity/post-attachment.entity';
import {PostCategory} from '../entity/post-category.entity';
import {CategoryNotFoundException} from '../exception/category-not-found.exception';
import {AttachmentUrlNotFoundException} from '../exception/attachment-url-not-found.exception';

@Injectable()
/**
 * @class AttachmentService
 */
export class AttachmentService {
  /**
   * AttachmentService Constructor
   *
   * @constructor
   * @param attachmentRepository
   */
  constructor(
    @InjectRepository(PostAttachment)
    private attachmentRepository: Repository<PostAttachment>,
  ) {
  }

  /**
   * Get Attachment By URL
   *
   * @public
   * @param url
   * @returns Promise<PostAttachment>
   */
  public async getByURL(url: string): Promise<PostAttachment> {
    const attachment: PostAttachment = await this.attachmentRepository.findOne({
      where: {url},
      relations: ['post'],
    });

    if (!attachment || attachment?.post.attachments[0].url !== url) {
      throw new AttachmentUrlNotFoundException(`Could not find attachment with ID: ${url}`);
    }

    return attachment;
  }

  /**
   * Generate Random ID
   *
   * @public
   * @param length
   * @returns Promise<string>
   */
  public async makeRandomId(length: number): Promise<string>  {
    let result: string;
    const characters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++ ) {
      result = characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return result;
  }
}
