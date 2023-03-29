import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import expressSession from "express-session";
import pg from "pg";
import grant from "grant";
import dotenv from "dotenv";
dotenv.config();

export const dbClient = new pg.Client({
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
});
dbClient.connect();

const grantExpress = grant.express({
  defaults: {
    origin: "http://localhost:8080",
    transport: "session",
    state: true,
  },
  google: {
    key: process.env.GOOGLE_CLIENT_ID || "",
    secret: process.env.GOOGLE_CLIENT_SECRET || "",
    scope: ["profile", "email"],
    callback: "/login/google",
  },
});

declare module "express-session" {
  interface SessionData {
    userIsLoggedIn?: boolean;
  }
  interface SessionData {
    driverIsLoggedIn?: boolean;
  }
}


const app = express();

// Section 1: Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  expressSession({
    secret: "group 2 is the best",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(grantExpress as express.RequestHandler);

// logging 用 middleware
app.use((req, _res, next) => {
  console.log(`Path ${req.path}, Method: ${req.method}`);
  next();
});

// Section 2: Route Handlers
import { usersAuthRoutes } from "./routers/usersAuthRoutes";
import { driversAuthRoutes } from "./routers/driversAuthRouters";

app.use("/usersLogin", usersAuthRoutes);
app.use("/driversLogin", driversAuthRoutes);

// Section 3: Serve
app.use(express.static(path.join(__dirname, "public")));

const guardUsersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.userIsLoggedIn) next();
  else res.sendFile(path.join(__dirname, "public", "index.html"));
};

const guardDriversMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.driverIsLoggedIn) next();
  else res.sendFile(path.join(__dirname, "public", "index.html"));
};

app.use(
  guardUsersMiddleware,
  express.static(path.join(__dirname, "private", "usersPrivate"))
);
app.use(
  guardDriversMiddleware,
  express.static(path.join(__dirname, "private", "driversPrivate"))
);
// Section 4: Error Handling
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
