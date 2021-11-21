//import config from 'config';
import jwt from 'jsonwebtoken';
import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/HttpException';

const tokenMiddleware = (): RequestHandler => {
  return (req, res, next) => {
    const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
    const secretKey: string = 'secretKey';
    if (!token) {
    return res.status(403).send("A token is required for authentication");
    }
  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    req.id=decoded._id;
    console.log(decoded);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};
};

export default tokenMiddleware;