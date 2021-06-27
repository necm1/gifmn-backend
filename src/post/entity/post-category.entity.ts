import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'post_categories'})
/**
 * @class PostCategory
 */
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({type: 'timestamp', select: false})
  created_at: Date;

  @Column({type: 'timestamp', nullable: true, select: false})
  updated_at: Date;
}
