import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany} from 'typeorm';
import {User} from '../../user/entity/user.entity';
import {PostContent} from '../model/post-content.model';
import {PostTag} from './post-tag.entity';
import {PostAttachment} from './post-attachment.entity';

@Entity({name: 'posts'})
/**
 * @class Post
 */
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User)
  @JoinColumn({name: 'user_id'})
  user: User;

  @Column()
  title: string;

  @Column()
  description: string;

  @OneToMany(() => PostAttachment, attachment => attachment.post, {
    eager: true
  })
  attachments: PostAttachment[];

  @OneToMany(() => PostTag, tag => tag.post, {
    eager: true
  })
  tags: PostTag[];

  @Column({type: 'timestamp'})
  created_at: Date;

  @Column({type: 'timestamp', nullable: true, select: false})
  updated_at: Date;
}
