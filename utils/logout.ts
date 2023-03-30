import express from "express";

export async function userLogout(req: express.Request, res: express.Response) {
  if (req.session) {
    delete req.session["user"];
  }
  res.redirect("../usersLogin.html");
}

export async function logout(req: express.Request, res: express.Response) {
  if (req.session) {
    delete req.session["driver"];
  }
  res.redirect("../driversLogin.html");
}