import type { Request, Response, NextFunction } from "express";
import path from "path";

export const userIsLoggedInStatic = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.users_id) {
    next();
  } else {
    res.redirect("/usersLogin.html");
  }
};

export const userIsLoggedInApi = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.users_id) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const driverIsLoggedInStatic = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.drivers_id) {
    next();
  } else {
    res.redirect("/driversLogin.html");
  }
};

export const driverIsLoggedInApi = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.drivers_id) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const guardUsersMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next();
};

export const guardDriversMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.driverIsLoggedIn) next();
  else res.sendFile(path.join(__dirname, "public", "index.html"));
};
