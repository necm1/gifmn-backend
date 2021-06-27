import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm';
import {Post} from './post.entity';

@Entity({name: 'posts_attachments'})
/**
 * @class PostAttachment
 */
export class PostAttachment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, post => post.tags)
  @JoinColumn({name: 'post_id'})
  post: Post;

  @Column()
  type: 'image' | 'video';

  @Column()
  url: string;

  @Column({type: 'timestamp', select: false})
  created_at: Date;

  @Column({type: 'timestamp', nullable: true, select: false})
  updated_at: Date;
}
