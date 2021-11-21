import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import tokenMiddleware from '@middlewares/token.middleware';

class UsersRoute implements Routes {
  public path = '/my-profile';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`,tokenMiddleware(), this.usersController.getUsers);
  }
}

export default UsersRoute;
