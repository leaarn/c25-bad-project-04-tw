import express from "express";

export const logoutRoutes = express.Router();

logoutRoutes.get("/users", usersLogout);
logoutRoutes.get("/drivers", driversLogout);

export async function usersLogout(req: express.Request, res: express.Response) {
  if (req.session) {
    delete req.session["user"];
  }
  res.redirect("../usersLogin.html");
}

export async function driversLogout(req: express.Request, res: express.Response) {
  if (req.session) {
    delete req.session["driver"];
  }
  res.redirect("../driversLogin.html");
}

// await fetch(`/logout/users`, { method: "GET" });
// await fetch(`/logout/drivers`, { method: "GET" });
