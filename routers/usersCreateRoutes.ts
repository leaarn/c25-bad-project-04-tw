import { dbClient } from "../app";
import { createUsers } from "../model";
import { hashPassword } from "../utils/hash";
import express from "express";

export const usersCreateRoutes = express.Router();

usersCreateRoutes.post("/", createAccount);

async function createAccount (req: express.Request, res: express.Response) {
    const lastName: string = req.body.newUsersLastName;
    const firstName: string = req.body.newUserFirstName;
    const title: string = req.body.newUserTitle;
    const email: string = req.body.newUsersEmail;
    const password: string = req.body.newUsersPassword;
    const contactNum: Number = req.body.newUsersContactNum;
    const defaultDistrict: string = req.body.newUsersDefaultDistrict;
    const defaultAddress: string = req.body.newUsersDefaultAddress;
    const defaultCoordinates: string = req.body.newUsersDefaultCoordinates;

    if (!email || !password) {
      res.status(400).json({ message: "please input the correct information" });
      return;
    }

const queryResult = await dbClient.query<createUsers>(
  /*SQL*/ `SELECT id, email FROM users WHERE email = $1 `,
  [email]
);

if (queryResult.rows[0]) {
    res.status(400).json({ message: "existing users!" });
    return;
}
  const hashedPassword = await hashPassword(password);
  await dbClient.query(
    `insert into "users" (last_name, first_name, title, email, password, contact_num, default_district, default_address, default_coordinates) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      lastName,
      firstName,
      title,
      email,
      hashedPassword,
      contactNum,
      defaultDistrict,
      defaultAddress,
      defaultCoordinates,
    ]
  );

 res.status(400).json({ message: "successful!" });
}

