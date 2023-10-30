import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TokenDecoded } from "../types";

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return res.json(
        {
          message: 'AUTH_REQUIRED'
        }
      )
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.json(
        {
          message: 'AUTH_REQUIRED'
        }
      )
    }
    const secret = process.env.JWT_SECRET

    const tokenDecoded = jwt.verify(token, secret as string) as TokenDecoded

    req.token = tokenDecoded

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
}

export { auth }