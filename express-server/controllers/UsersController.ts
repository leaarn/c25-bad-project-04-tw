import { UsersService } from "../services/UsersService";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
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
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  loginUserControl = async (req: Request, res: Response) => {
    req.session.loginType = "user";
    res.redirect("/connect/google");
    try {
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  loginDriverControl = async (req: Request, res: Response) => {
    req.session.loginType = "driver";
    res.redirect("/connect/google");
    try {
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  loginGoogleControl = async (req: Request, res: Response) => {
    try {
      const accessToken = req.session?.["grant"].response.access_token;

      const fetchRes = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          method: "get",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await fetchRes.json();

      if (req.session.loginType === "user") {
        let finalResult = await this.usersService.loginGoogle(result);
        if (finalResult) {
          req.session.userIsLoggedIn = true;
          req.session.users_id = finalResult.id;
          res.json({ message: "users OAuth login success" });
        }
      }

      if (req.session.loginType === "driver") {
        let finalResult = await this.usersService.loginGoogle(result);
        if (finalResult) {
          req.session.driverIsLoggedIn = true;
          req.session.drivers_id = finalResult.id;
          res.json({ message: "drivers OAuth login success" });
        }
      }
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
