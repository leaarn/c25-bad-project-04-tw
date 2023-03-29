import { dbClient } from "../app";
import { driversLogin } from "../model";
import { checkPassword, hashPassword } from "../utils/hash";
import crypto from "crypto";
import express from "express";
import { logger } from "../utils/logger";

export const driversAuthRoutes = express.Router();

driversAuthRoutes.post("/", login);
driversAuthRoutes.get("/google", loginGoogle);

async function login(req:express.Request, res:express.Response){
  try {
    const driversEmail: string = req.body.driversEmail;
    const password: string = req.body.password;
    if (!driversEmail || !password) {
      res.status(400).json({ message: "missing username or password!" });
      return;
    }

    const queryResult = await dbClient.query<driversLogin>(
      /*SQL*/ `SELECT id, email, password FROM drivers WHERE email = $1 `,
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
    res.json({ message: "login success" });

  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function loginGoogle(req: express.Request, res: express.Response) {
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
      const queryResult = await dbClient.query<driversLogin>(
        /*SQL*/ `SELECT id, email FROM drivers WHERE email = $1 `,
        [result.driversEmail]
      );

      if (!queryResult.rows[0]) {
        console.log("no such driver,create one ");
        const tempPass = crypto.randomBytes(20).toString("hex");
        const hashedPassword = await hashPassword(tempPass);
        await dbClient.query(
          `insert into "drivers" (email,password) values ($1,$2)`,
          [result.driversEmail, hashedPassword]
        );
      }

      req.session.userIsLoggedIn = true;
      res.json({ message: "OAuth login success" });
    } catch (err: any) {
      logger.error(err.message);
      res.status(500).json({ message: "internal server error" });
    }
}

