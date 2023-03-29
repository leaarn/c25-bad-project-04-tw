import { dbClient } from "../app";
import { createDrivers } from "../model";
import { hashPassword } from "../utils/hash";
import crypto from "crypto";
import express from "express";

export const driversCreateRoutes = express.Router();

driversCreateRoutes.post("/", createAccount);

async function createAccount(req: express.Request, res: express.Response) {
  const newDriversEmail: string = req.body.newUsersEmail;
  const password: string = req.body.password;
  if (!newDriversEmail || !password) {
    res.status(400).json({ message: "please input the correct information" });
    return;
  }

  const queryResult = await dbClient.query<createDrivers>(
    /*SQL*/ `SELECT id, email FROM users WHERE email = $1 `,
    [newDriversEmail]
  );

  if (queryResult.rows[0]) {
    res.status(400).json({ message: "existing drivers!" });
    return;
  }
  const tempPass = crypto.randomBytes(20).toString("hex");
  const hashedPassword = await hashPassword(tempPass);
  await dbClient.query(`insert into "drivers" (email,password) values ($1,$2)`, [
    newDriversEmail,
    hashedPassword,
  ]);

  res.status(400).json({ message: "successful!" });
}
