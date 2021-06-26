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

  @OneToMany(() => PostTag, tag => tag.post)
  tags: PostTag[];

  @OneToMany(() => PostAttachment, attachment => attachment.post)
  attachments: PostAttachment[];

  @Column({type: 'timestamp', name: 'created_at'})
  createdAt: Date;

  @Column({type: 'timestamp', name: 'updated_at', nullable: true})
  updatedAt: Date;
}
