import { ReactChild, ReactChildren } from "react";

export interface PropsI {
  children: ReactChild | ReactChildren;
}

export interface PostI {
  body: string;
  created_at: string;
  id: number;
  subname: string;
  title: string;
  updata_at: string;
  userid: number;
  username: string;
  user: null | object;
  sub: null | object;
  voteScore: number;
  userVote: number;
  commentCount: number;
}

export enum TypeE {
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
}

export interface UserI {
  id: number;
  name: string;
}

export interface LoginI {
  type: TypeE.LOGIN;
  payload: UserI;
}

export interface LogoutI {
  type: TypeE.LOGOUT;
}

export type ActionI = LoginI | LogoutI;

export interface InitialStateI {
  log: boolean;
  user: UserI | null;
}
