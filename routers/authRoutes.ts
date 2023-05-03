import { authController } from "../app";
import express from "express";

export const authRoutes = express.Router();

authRoutes.get("/", authController.loginUser);
authRoutes.get("/driver", authController.loginDriver);

