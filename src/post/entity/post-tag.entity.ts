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

  @Column({type: 'timestamp', name: 'created_at'})
  createdAt: Date;

  @Column({type: 'timestamp', name: 'updated_at', nullable: true})
  updatedAt: Date;
}
