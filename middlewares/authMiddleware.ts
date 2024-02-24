import { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.cookies);
    if (req.cookies.isLoggedIn) {
      next();
    } else {
      res.status(401).send("Please login to access this resource");
    }
  } catch (error) {}
};
