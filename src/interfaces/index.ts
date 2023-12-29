import { Document, Schema } from "mongoose";

export interface IUser {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  watchHistory?: Schema.Types.ObjectId[];
  password: string;
  refreshToken?: string;
}

export interface IVideo extends Document {
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views?: number;
  isPublished?: boolean;
  owner: Schema.Types.ObjectId;
}
