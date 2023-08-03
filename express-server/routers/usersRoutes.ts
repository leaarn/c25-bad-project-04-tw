import { usersController } from "../app";
import express from "express";


export const usersRoutes = express.Router();

usersRoutes.post("/", usersController.loginControl);
usersRoutes.get("/usersGoogle", usersController.loginUserControl);
usersRoutes.get("/driversGoogle", usersController.loginDriverControl);
usersRoutes.get("/google", usersController.loginGoogleControl);
usersRoutes.post(
  "/createaccount",
  usersController.createAccountControl
);
