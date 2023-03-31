import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { dbClient } from "../app";

import { sendMessage, getTextMessageInput } from "./messageHelper";
dotenv.config();

export const receiverRoutes = express.Router();
receiverRoutes.use(bodyParser.json());
receiverRoutes.post("/", message);

async function message(req: express.Request, res: express.Response) {
//req
  const data = getTextMessageInput(
    process.env.RECIPIENT_WAID,
    "recipient token: ABC123! https://ip:8080.com"
  );

  sendMessage(data)
    .then(function (response) {
      res.status(200).json({ message: "message sent!" });
      return;
    })
    .catch(function (error) {
      console.log(error);
      return;
    });
};
