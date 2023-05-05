import { DriversService } from "../services/DriversService";
import { Request, Response } from "express";
import { logger } from "../utils/logger";

export class DriversController {
  constructor(private driversService: DriversService) {}

  loginControl = async (req: Request, res: Response) => {
    try {
      const driversEmail: string = req.body.driversEmail;
      const password: string = req.body.password;
      const foundDriver = await this.driversService.login(
        driversEmail,
        password
      );

      if (foundDriver) {
        req.session.driverIsLoggedIn = true;
        req.session.drivers_id = foundDriver.id;
        req.session.firstName = foundDriver.first_name;
        res.json({ message: "login success" });
      }
    } catch (err: any) {
      logger.error(err.message);
      res.status(400).json({ message: err.message });
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
      const carLicenseNum: string = req.body.carLicenseNum;
      const carType: string = req.body.carType;

      const driverId = await this.driversService.createAccount({
        lastName,
        firstName,
        title,
        email,
        password,
        contactNum,
        carLicenseNum,
        carType,
      });

      if (!email || !password) {
        res
          .status(400)
          .json({ message: "please input the correct information" });
        return;
      }
      req.session.driverIsLoggedIn = true;
      req.session.drivers_id = +driverId;
      res.status(200).json({ message: "successful!" });
    } catch (err: any) {
      logger.error(err.message);
      res.status(400).json({ message: err.message });
    }
  };
}
