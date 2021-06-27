import {Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne} from 'typeorm';
import {Post} from './post.entity';
import {User} from '../../user/entity/user.entity';

@Entity({name: 'posts_tags'})
/**
 * @class PostTag
 */
export class PostTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, post => post.tags)
  @JoinColumn({name: 'post_id'})
  post: Post;

  @Column()
  name: string;

  @Column({type: 'timestamp'})
  created_at: Date;

  @Column({type: 'timestamp', nullable: true, select: false})
  updated_at: Date;
}
