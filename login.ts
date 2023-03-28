import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import expressSession from "express-session";
import { UsersLogin } from "./model";
import { DriversLogin } from "./model";



const app = express();

// Section 1: Middleware
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "Tecky Academy teaches typescript",
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
app.use((req, _res, next) => {
  console.log(`Path ${req.path}, Method: ${req.method}`);
  next();
});

app.post("/login", async (req, res) => {
  const username: string = req.body.username;
  const password: string = req.body.password;
  if (!username || !password) {
    res.status(400).json({ message: "missing username or password" });
    return;
  }

  const users: Array<UsersLogin> = ;
  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );
  if (!foundUser) {
    res.status(400).json({ message: "invalid username or password" });
    return;
  }

  req.session.isLoggedIn = true;
  // res.json({message: "login success"})
  res.redirect("/admin.html");
});

// Section 3: Serve
app.use(express.static(path.join(__dirname, "public")));
const guardMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.isLoggedIn) next();
  else res.redirect("/");
};
app.use(guardMiddleware, express.static(path.join(__dirname, "private")));

// Section 4: Error Handling
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
