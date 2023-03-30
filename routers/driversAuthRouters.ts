import { dbClient } from "../app";
import { driversLogin } from "../model";
import { checkPassword } from "../utils/hash";
import express from "express";
import { logger } from "../utils/logger";

export const driversAuthRoutes = express.Router();

driversAuthRoutes.post("/", login);

async function login(req:express.Request, res:express.Response){
  try {
    const driversEmail: string = req.body.driversEmail;
    const password: string = req.body.password;
    if (!driversEmail || !password) {
      res.status(400).json({ message: "missing username or password!" });
      return;
    }

    const queryResult = await dbClient.query<driversLogin>(
      /*SQL*/ `SELECT id, first_name,email, password FROM drivers WHERE email = $1 `,
      [driversEmail]
    );

    const foundDriver = queryResult.rows[0];

    if (!foundDriver) {
      res.status(400).json({ message: "invalid username " });
      return;
    }

    if (!(await checkPassword(password, foundDriver.password))) {
      res.status(400).json({ message: "invalid password " });
      return;
    }
    req.session.driverIsLoggedIn = true;
    req.session.drivers_id = foundDriver.id;
    console.log("session:", req.session.drivers_id);
    req.session.firstName = foundDriver.first_name;
    console.log("session:", req.session.firstName);

    res.json({ message: "login success" });

  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}
