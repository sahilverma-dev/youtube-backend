import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { User } from "../models/user.model";

import { uploadOnCloudinary } from "../services/cloudnary/config";
import { ApiResponse } from "../utils/ApiResponse";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { fullName, username, email, password } = req.body;

    if (
      [fullName, username, email, password].some((item) => item?.trim() === "")
    ) {
      throw new ApiError(400, "All felids are required");
    }

    const existedUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existedUser) {
      throw new ApiError(409, "User already exists");
    }

    const files = req.files as {
      [key: string]: Express.Multer.File[];
    };

    const avatarLocalPath = files?.avatar[0].path;
    const coverImageLocalPath = files?.coverImage
      ? files?.coverImage[0]?.path
      : null;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const coverImage =
      coverImageLocalPath !== null
        ? await uploadOnCloudinary(coverImageLocalPath)
        : null;

    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
      avatar: avatar.url,
      coverImage: coverImage !== null ? coverImage?.url : "",
      email,
      fullName,
      password,
      username: username?.toLowerCase()?.trim(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (createdUser) {
      res
        .status(201)
        .json(new ApiResponse(200, "User created", { user: createdUser }));
    } else {
      throw new ApiError(500, "Something went wrong while creating user");
    }
  }
);
