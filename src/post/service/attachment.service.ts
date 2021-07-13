import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {PostAttachment} from '../entity/post-attachment.entity';
import {AttachmentUrlNotFoundException} from '../exception/attachment-url-not-found.exception';
import {FileModel} from '../model/file.model';
import {Post} from '../entity/post.entity';

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
   * @public
   * @param post
   * @param attachments
   * @param descriptions
   */
  public async create(post: Post, attachments: FileModel[], descriptions?: [{name: string, description: string}]): Promise<PostAttachment[]> {
    const attachmentEntities: PostAttachment[] = [];

    for await (const file of attachments) {
      const description = descriptions?.filter(entry => entry.name === file.old)[0];

      const attachment = this.attachmentRepository.create();
      attachment.post = post;
      attachment.url = file.name;
      attachment.type = file.type;
      attachment.description = description?.description;

      // push to array
      attachmentEntities.push(attachment);

      // create database entry
      await this.attachmentRepository.save(attachmentEntities);
    }

    return attachmentEntities;
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
