import { Entity, Column, BeforeInsert, OneToMany, Index } from "typeorm";
import { IsEmail, Length } from "class-validator";
import bcrypt from "bcryptjs";
import { Exclude } from "class-transformer";
import { Model } from "./Model";
import { Post } from "./Post";
import { Sub } from "./Sub";
import { Vote } from "./Vote";
import { Comment } from "./Comment";

@Entity("users")
export class User extends Model {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
  @Index({ unique: true })
  @Column()
  @Length(3, 100, { message: "not good name" })
  name: string;

  @Index({ unique: true })
  @Column()
  @IsEmail(undefined, { message: "not valid email" })
  email: string;

  @Column()
  @Length(6, 255, { message: "not good password" })
  @Exclude()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Sub, (sub) => sub.user)
  subs: Sub[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
