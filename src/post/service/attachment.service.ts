import {CACHE_MANAGER, HttpException, Inject, Injectable} from '@nestjs/common';
import {PostAttachment} from '../entity/post-attachment.entity';
import {AttachmentUrlNotFoundException} from '../exception/attachment-url-not-found.exception';
import {FileModel} from '../model/file.model';
import {Post} from '../entity/post.entity';
import {AttachmentRepository} from '../repository/attachment.repository';
import {TagIdDeleteFailedException} from '../exception/tag-id-delete-failed.exception';
import {PostTag} from '../entity/post-tag.entity';
import {Like} from 'typeorm';

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
   * @param cacheManager
   */
  constructor(
    private attachmentRepository: AttachmentRepository,
    @Inject(CACHE_MANAGER)
    private cacheManager
  ) {
    this.attachmentRepository.setProvider(cacheManager);
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
      await this.attachmentRepository.save(attachment);
    }

    return attachmentEntities;
  }

  /**
   * Search Post
   *
   * @public
   * @async
   * @param query
   */
  public async search(query: string): Promise<PostAttachment[]> {
    return await this.attachmentRepository.find({
      relations: ['post'],
      where: {
        description: Like(`%${query}%`),
      }
    })
  }

  /**
   * @public
   * @async
   * @param attachments
   */
  public async update(attachments: PostAttachment[]): Promise<void> {
    for (const attach of attachments) {
      await this.attachmentRepository.update(attach.id, attach);
    }
  }

  /**
   * Delete Attachment By URL
   *
   * @public
   * @async
   * @param url
   * @returns Promise<boolean>
   */
  public async deleteByUrl(url: string): Promise<boolean> {
    const result = await this.attachmentRepository.delete({url});

    if (!result.affected || result.affected === 0) {
      //@todo create AttachmentUrlDeleteFailedException
      throw new HttpException(`Could not delete Attachment ${url}`, 500);
    }

    return true;
  }

  /**
   * Get Attachment By URL
   *
   * @public
   * @param url
   * @returns Promise<PostAttachment>
   */
  public async getByURL(url: string, force = false, first = true): Promise<PostAttachment> {
    const attachment: PostAttachment = await this.attachmentRepository.findOne({
      where: {url},
      relations: ['post'],
    }, {force});

    if (!attachment || (first && attachment?.post.attachments[0].url !== url)) {
      throw new AttachmentUrlNotFoundException(`Could not find attachment with URL: ${url}`);
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
