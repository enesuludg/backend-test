import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@/interfaces/users.interface';
import AuthService from '@services/auth.service';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const {signUpUserData,link} = await this.authService.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup',link: link });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { Token } = await this.authService.login(userData);

      //res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ token: Token, message: 'login' });
    } catch (error) {
      next(error);
    }
  };
  public verify = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id= req.query.id;
      const code= req.query.token;

       await this.authService.verify( id, code );

      //res.setHeader('Set-Cookie', [cookie]);
      res.status(200).end("Email  is been Successfully verified");
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
  public code = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const code= req.body.code;

      const { newCode } = await this.authService.code( code );

      //res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data: newCode, message: 'code' });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  public logOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData= req.body.email;
      console.log(userData);
      const logOutUserData = await this.authService.logout(userData);
      
      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: logOutUserData, message: 'logout' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
