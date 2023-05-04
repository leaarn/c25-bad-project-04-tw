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

      // if (req.session.loginType === "user") {
      let userType = req.session.loginType;
      let foundUser: { id: number; name: string } | null = null;
      if (userType) {
        foundUser = await this.usersService.loginGoogle(userType, result);
      }
      if (!foundUser) {
        res.status(401).json({ message: "unauthorized user" });
      } else {
        req.session.userIsLoggedIn = true;
        req.session.users_id = foundUser.id;
        req.session.firstName = foundUser.name;
        res.json({ message: "users OAuth login success" });
      }
      // }

      // if (req.session.loginType === "driver") {
      //   let foundDriver = await this.usersService.loginGoogle(result);
      //   if (foundDriver) {
      //     req.session.driverIsLoggedIn = true;
      //     req.session.drivers_id = foundDriver.id;
      //     res.json({ message: "drivers OAuth login success" });
      //   }
      // }

      if (req.session.loginType === "user") {
        req.session.userIsLoggedIn = true;
      } else if (req.session.loginType === "driver") {
        req.session.driverIsLoggedIn = true;
      } else {
        res.status(400).send("Incorrect login type");
        return;
      }

      if (req.session.loginType === "user") {
        res.redirect("/usersMain.html");
      } else {
        res.redirect("/driversMain.html");
      }
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };

  createAccountControl = async (req: Request, res: Response) => {
    try {
      const lastName: string = req.body.lastName;
      const firstName: string = req.body.firstName;
      const title: string = req.body.title;
      const email: string = req.body.email;
      const password: string = req.body.password;
      const contactNum: Number = req.body.contactNum;
      const defaultDistrict: string = req.body.defaultDistrict;
      const defaultRoom: string = req.body.defaultRoom;
      const defaultFloor: string = req.body.defaultFloor;
      const defaultBuilding: string = req.body.defaultBuilding;
      const defaultStreet: string = req.body.defaultStreet;

      const userId = await this.usersService.createAccount({
        lastName,
        firstName,
        title,
        email,
        password,
        contactNum,
        defaultDistrict,
        defaultRoom,
        defaultFloor,
        defaultBuilding,
        defaultStreet,
      });

      if (!email || !password) {
        res
          .status(400)
          .json({ message: "please input the correct information" });
        return;
      }
      req.session.userIsLoggedIn = true;
      req.session.users_id = +userId;
      res.status(200).json({ message: "successful!" });
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
  };
}
