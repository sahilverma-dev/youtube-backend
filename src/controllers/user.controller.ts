import { User } from "./../models/user.model";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

import { uploadOnCloudinary } from "../services/cloudnary/config";
import { ApiResponse } from "../utils/ApiResponse";
import { Types } from "mongoose";

const generateAccessAndRefreshToken = async (userId: Types.ObjectId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user?.generateAccessToken();
    const refreshToken = user?.generateRefreshToken();

    if (user) {
      user.refreshToken = refreshToken;
      await user?.save({ validateBeforeSave: false });
    }

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token "
    );
  }
};

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

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if ((!username || !email) && !password) {
    throw new ApiError(400, "username or email are required");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (user) {
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (isPasswordCorrect) {
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );

      const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
          new ApiResponse(200, "User Logged In successful", {
            user: loggedInUser,
            refreshToken,
          })
        );
    } else {
      throw new ApiError(401, "Password is not correct");
    }
  } else {
    throw new ApiError(404, "User not found");
  }
});
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { user } = req;

  await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const option = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, "User Logged out Successfully"));
});
