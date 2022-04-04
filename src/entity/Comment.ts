import { Expose } from "class-transformer";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Model } from "./Model";
import { Post } from "./Post";
import { User } from "./User";
import { Vote } from "./Vote";

@Entity("comments")
export class Comment extends Model {
  constructor(comment: Partial<Comment>) {
    super();
    Object.assign(this, comment);
  }

  @Column()
  body: string;

  // @Column()
  // postId: number;
  // @Column()
  // userid: number;

  @Column()
  username: string;

  @Column()
  postname: string;

  @ManyToOne(() => Post, (post) => post.comments)
  @JoinColumn({ name: "postname", referencedColumnName: "title" })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: "username", referencedColumnName: "name" })
  user: User;

  @OneToMany(() => Vote, (vote) => vote.comment)
  votes: Vote[];

  @Expose() get voteScore(): number {
    return this.votes?.reduce((a, b) => a + (b.value || 0), 0);
  }

  protected userVote: number;
  setUserVote(user: User) {
    const index = this.votes.findIndex((v) => v.username === user.name);
    this.userVote = index > -1 ? this.votes[index].value : 0;
  }
}
