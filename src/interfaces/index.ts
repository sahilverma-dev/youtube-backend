import { Request } from "express";
import { Document, Model, Types } from "mongoose";

export interface RequestWithUser extends Request {
  user: IUser;
}

export interface IUser {
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  coverImage?: string;
  watchHistory?: Types.ObjectId[];
  password: string;
  refreshToken?: string;
}

export interface IUserMethods {
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

export type UserModel = Model<IUser, unknown, IUserMethods>;

export interface IVideo extends Document {
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views?: number;
  isPublished?: boolean;
  owner: Types.ObjectId;
}
