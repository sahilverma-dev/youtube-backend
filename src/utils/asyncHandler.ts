import { NextFunction, Request, Response } from "express";
import { RequestWithUser } from "../interfaces";

const asyncHandler = (
  requestHandler: (
    req: Request | RequestWithUser,
    res: Response,
    next: NextFunction
  ) => Promise<void>
) => {
  return async (
    req: Request | RequestWithUser,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await requestHandler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

export { asyncHandler };
