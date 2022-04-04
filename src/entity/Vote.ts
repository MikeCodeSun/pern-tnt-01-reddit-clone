import { Expose } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Comment } from "./Comment";
import { Model } from "./Model";
import { Post } from "./Post";
import { User } from "./User";

@Entity("votes")
export class Vote extends Model {
  constructor(vote: Partial<Vote>) {
    super();
    Object.assign(this, vote);
  }

  @Column()
  value: number;

  @Column()
  username: string;

  @ManyToOne(() => User, (user) => user.votes)
  @JoinColumn({ name: "username", referencedColumnName: "name" })
  user: User;

  @ManyToOne(() => Post, (post) => post.votes)
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.votes)
  comment: Comment;
}
