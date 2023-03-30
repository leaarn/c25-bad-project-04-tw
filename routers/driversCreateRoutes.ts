import { dbClient } from "../app";
import { createDrivers } from "../model";
import { hashPassword } from "../utils/hash";
import express from "express";

export const driversCreateRoutes = express.Router();

driversCreateRoutes.post("/", createAccount);

async function createAccount(req: express.Request, res: express.Response) {
  const lastName: string = req.body.newDriverLastName;
  const firstName: string = req.body.newDriverFirstName;
  const title: string = req.body.newDriverTitle;
  const email: string = req.body.newDriverEmail;
  const password: string = req.body.newDriverPassword;
  const contactNum: Number = req.body.newDriverContactNum;
  const carLicenseNum: string = req.body.newDriverCarLicenseNum;
  const carType: string = req.body.newDriverCarType;
  // const defaultCoordinates: string = req.body.newUsersDefaultCoordinates;

  if (!email || !password) {
    res.status(400).json({ message: "please input the correct information" });
    return;
  }

  const queryResult = await dbClient.query<createDrivers>(
    /*SQL*/ `SELECT id, email FROM drivers WHERE email = $1 `,
    [email]
  );

  if (queryResult.rows[0]) {
    res.status(400).json({ message: "existing drivers!" });
    return;
  }
  const hashedPassword = await hashPassword(password);
  await dbClient.query(
    `insert into "drivers" (last_name, first_name, title, email, password, contact_num, car_license_num,car_type) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      lastName,
      firstName,
      title,
      email,
      hashedPassword,
      contactNum,
      carLicenseNum,
      carType,
    ]
  );
  req.session.userIsLoggedIn = true;
  res.status(200).json({ message: "successful!" });
}

