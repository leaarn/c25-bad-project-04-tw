import { dbClient } from "../app";
import { usersLogin } from "../model";
import { checkPassword, hashPassword } from "../utils/hash";
import crypto from "crypto";
import express from "express";

export const usersAuthRoutes = express.Router();

usersAuthRoutes.post("/", login);
usersAuthRoutes.get("/google", loginGoogle);

async function login(req: express.Request, res: express.Response) {
  const usersEmail: string = req.body.usersEmail;
  const password: string = req.body.password;
  if (!usersEmail || !password) {
    res.status(400).json({ message: "missing username or password!" });
    return;
  }

  const queryResult = await dbClient.query<usersLogin>(
    /*SQL*/ `SELECT id, email, password FROM users WHERE email = $1 `,
    [usersEmail]
  );

  const foundUser = queryResult.rows[0];

  if (!foundUser) {
    res.status(400).json({ message: "invalid username " });
    return;
  }

  if (!(await checkPassword(password, foundUser.password))) {
    res.status(400).json({ message: "invalid password" });
    return;
  }

  req.session.userIsLoggedIn = true;
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
  const queryResult = await dbClient.query<usersLogin>(
    /*SQL*/ `SELECT id, email FROM users WHERE email = $1 `,
    [result.usersEmail]
  );

  if (!queryResult.rows[0]) {
    console.log("no such user,create one ");
    const tempPass = crypto.randomBytes(20).toString("hex");
    const hashedPassword = await hashPassword(tempPass);
    await dbClient.query(
      `insert into "users" (email,password) values ($1,$2)`,
      [result.usersEmail, hashedPassword]
    );
  }

  req.session.userIsLoggedIn = true;
  res.json({ message: "OAuth login success" });
}
