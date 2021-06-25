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

  @Column()
  password: string;

  @Column({name: 'last_ip'})
  lastIp: string;

  @Column({type: 'timestamp', name: 'created_at'})
  createdAt: Date;

  @Column({type: 'timestamp', name: 'updated_at', nullable: true})
  updatedAt: Date;
}
