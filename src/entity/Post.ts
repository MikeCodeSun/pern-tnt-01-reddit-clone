import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  Index,
  JoinColumn,
} from "typeorm";
import { Comment } from "./Comment";
import { Model } from "./Model";
import { Sub } from "./Sub";
import { User } from "./User";
import { Vote } from "./Vote";
import { Expose, Exclude } from "class-transformer";

@Entity("posts")
export class Post extends Model {
  constructor(post: Partial<Post>) {
    super();
    Object.assign(this, post);
  }

  @Index({ unique: true })
  @Column()
  title: string;

  @Column({ nullable: true, type: "text" })
  body: string;

  @Column()
  subname: string;

  @Column()
  username: string;

  @Column()
  userid: number;

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: "username", referencedColumnName: "name" })
  user: User;

  @ManyToOne(() => Sub, (sub) => sub.posts)
  @JoinColumn({ name: "subname", referencedColumnName: "name" })
  sub: Sub;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Vote, (vote) => vote.post)
  votes: Vote[];

  @Expose() get commentCount(): number {
    return this.comments?.length;
  }

  @Expose() get voteScore(): number {
    return this.votes?.reduce((a, b) => a + (b.value || 0), 0);
  }
  // user vote mark
  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes.findIndex((v) => v.username === user.name);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }

  // protected abc: number;
  // getN() {
  //   this.abc = 1;
  // }

  // @Expose() get abc(): string {
  //   return this.title + "abc";
  // }
}
