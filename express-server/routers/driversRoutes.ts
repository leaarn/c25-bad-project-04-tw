import { driversController } from "../app";
import express from "express";

export const driversRoutes = express.Router();

driversRoutes.post("/", driversController.loginControl);
driversRoutes.post(
  "/createaccount",
  driversController.createAccountControl
);
