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

    console.log(req.files);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const coverLocalPath = req.files?.avatar[0]?.path;

    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }
    console.log({ avatarLocalPath, coverLocalPath });
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverLocalPath);
    if (!avatar) {
      throw new ApiError(400, "Avatar file is required");
    }

    const user = await User.create({
      avatar: avatar.url,
      coverImage: coverImage ? coverImage?.url : "",
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
        .json(new ApiResponse(20, "User created", { user: createdUser }));
    } else {
      throw new ApiError(500, "Something went wrong while creating user");
    }
  }
);
