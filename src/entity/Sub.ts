import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  OneToMany,
} from "typeorm";
import { Model } from "./Model";
import { User } from "./User";
import { Post } from "./Post";
import { Expose } from "class-transformer";

@Entity("subs")
export class Sub extends Model {
  constructor(sub: Partial<Sub>) {
    super();
    Object.assign(this, sub);
  }

  @Index({ unique: true })
  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  userid: number;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => User, (user) => user.subs)
  @JoinColumn({ name: "username", referencedColumnName: "name" })
  user: User;

  @OneToMany(() => Post, (post) => post.sub)
  posts: Post[];

  @Expose()
  get getImageUrl(): string {
    return this.image
      ? `http://localhost:4000/img/${this.image}`
      : "https://images.pexels.com/photos/6157055/pexels-photo-6157055.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500";
  }
}
