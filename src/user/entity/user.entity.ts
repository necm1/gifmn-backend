import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name: 'users'})
/**
 * @class User
 */
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
}
