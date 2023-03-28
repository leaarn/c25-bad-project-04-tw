import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import expressSession from "express-session";
import { UsersLogin } from "../model";
import { DriversLogin } from "../model";
export const authRoutes = express.Router();
import { Client } from "pg";
import dotenv from "dotenv";
dotenv.config();
// pendind import to app.ts
// import { authRoutes } from "./routers/authRoutes";

// Section 1: Middleware
authRoutes.use(express.urlencoded({ extended: true }));
authRoutes.use(express.json())
authRoutes.use(
  expressSession({
    secret: "project 2",
    resave: true,
    saveUninitialized: true,
  })
);

declare module "express-session" {
  interface SessionData {
    isLoggedIn?: boolean;
  }
}

// logging 用 middleware
authRoutes.post("/usersLogin", async (req, res) => {
  const username: string = req.body.username;
  const password: string = req.body.password;
  if (!username || !password) {
    res.status(400).json({ message: "missing username or password" });
    return;
  }

  const users: Array<UsersLogin> = await client.query(
    /*SQL*/ `DELETE FROM order_animals`
  );
  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!foundUser) {
    res.status(400).json({ message: "invalid username or password" });
    return;
  }

  req.session.isLoggedIn = true;
  res.redirect("/admin.html");
});

// Section 3: Serve
authRoutes.use(express.static(path.join(__dirname, "public")));
const guardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isLoggedIn) next();
  else res.redirect("/");
};
authRoutes.use(guardMiddleware, express.static(path.join(__dirname, "private")));

