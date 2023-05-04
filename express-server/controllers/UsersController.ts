import { UsersService } from "../services/UsersService";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { body, validationResult } from "express-validator";
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
      body("password")
        .isStrongPassword({
          minLength: 6,
          minLowercase: 0,
          minUppercase: 0,
          minSymbols: 0,
        })
        .withMessage("Length>6,No Symbol");

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: "Please fill in all the boxes!" });
        return;
      }

      const lastName: string = req.body.lastName;
      const firstName: string = req.body.firstName;
      const title: string = req.body.title;
      const email: string = req.body.email;
      const password: string = req.body.password;
      const contactNum: Number = req.body.contactNum;
      const defaultDistrict: string = req.body.defaultDistrict;
      const pickUpRoom: string = req.body.pickUpRoom;
      const pickUpFloor: string = req.body.pickUpFloor;
      const pickUpBuilding: string = req.body.pickUpBuilding;
      const pickUpStreet: string = req.body.pickUpStreet;

      if (!email || !password) {
        res
          .status(400)
          .json({ message: "please input the correct information" });
        return;
      }

      const foundUser = await this.usersService.createAccount(email, password);
      if (foundUser) {
        res.status(400).json({ message: "existing users!" });
        return;
      }
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };
}
