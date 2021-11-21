import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { User } from '@/interfaces/users.interface';
import userService from '@services/users.service';
import userModel from '@models/users.model';


class UsersController {
  public userService = new userService();
  public users = userModel;

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findOneUserData: User = await this.userService.findUserById(req.id);
      res.status(200).json({ data: findOneUserData, message: 'profile' });
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
