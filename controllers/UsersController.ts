import { UsersService } from "../services/UsersService";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { checkPassword, hashPassword } from "../utils/hash";
export class UsersController {
  constructor(private usersService: UsersService) {}

  loginControl = async (req: Request, res: Response) => {
    try {
      const usersEmail: string = req.body.usersEmail;
      const password: string = req.body.password;
      const foundUser = await this.usersService.login(usersEmail, password);

      if (foundUser) {
        req.session.userIsLoggedIn = true;
        req.session.users_id = foundUser.id;
        req.session.firstName = foundUser.first_name;
        res.json({ message: "login success" });
      }

      if (!foundUser) {
        res.status(400).json({ message: "invalid email address " });
        return;
      }

      if (!(await checkPassword(password, foundUser.password))) {
        res.status(400).json({ message: "invalid password" });
        return;
      }
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  loginUserControl = async (req: Request, res: Response) => {
    try {
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  loginDriverControl = async (req: Request, res: Response) => {
    try {
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  loginGoogleControl = async (req: Request, res: Response) => {
    try {
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  createAccountControl = async (req: Request, res: Response) => {
    try {
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };
}
