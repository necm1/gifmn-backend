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

  @Column({type: 'timestamp', name: 'created_at'})
  createdAt: Date;

  @Column({type: 'timestamp', name: 'updated_at', nullable: true})
  updatedAt: Date;
}
