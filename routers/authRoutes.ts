import { dbClient } from "./../app";
import { UsersLogin } from "../model";
import { DriversLogin } from "../model";
import { checkPassword, hashPassword } from "../utils/hash";
import crypto from "crypto";
import express from "express";

export const authRoutes = express.Router();

authRoutes.post("/usersLogin", login);
authRoutes.post("/driversLogin", login);
authRoutes.get("/usersLogin/google", loginGoogle);
authRoutes.get("/driversLogin/google", loginGoogle);

async function login(req: express.Request, res: express.Response) {
  const username: string = req.body.username;
  const password: string = req.body.password;
  if (!username || !password) {
    res.status(400).json({ message: "missing username or password" });
    return;
  }

  const queryResult = await dbClient.query<UsersLogin>(
    /*SQL*/ `SELECT id, email, password FROM users WHERE email = $1 `,
    [username]
  );
  // queryResult.rows -> Array of Result Row
  const foundUser = queryResult.rows[0];

  if (!foundUser) {
    res.status(400).json({ message: "invalid username " });
    return;
  }

  if (!(await checkPassword(password, foundUser.password))) {
    res.status(400).json({ message: "invalid password" });
    return;
  }

  req.session.isLoggedIn = true;
  res.json({ message: "login success" });
}

async function loginGoogle(req: express.Request, res: express.Response) {
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
  const queryResult = await dbClient.query<UsersLogin>(
    /*SQL*/ `SELECT id, username FROM users WHERE username = $1 `,
    [result.email]
  );

  // console.log(queryResult.rows[0])
  if (!queryResult.rows[0]) {
    console.log("no such user,create one ");
    const tempPass = crypto.randomBytes(20).toString("hex");
    const hashedPassword = await hashPassword(tempPass);
    await dbClient.query(
      `insert into "users" (username,password) values ($1,$2)`,
      [result.email, hashedPassword]
    );
  }

  req.session.isLoggedIn = true;
  res.json({ message: "OAuth login success" });
}
