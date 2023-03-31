import express from "express";
import dotenv from "dotenv";
// import { dbClient } from "../app";

import { sendMessage, getTextMessageInput } from "./messageHelper";
dotenv.config();

export const receiverRoutes = express.Router();
receiverRoutes.post("/", message);

async function message(req: express.Request, res: express.Response) {
  //req
  const data = getTextMessageInput(
    // const users = req.session.users_id;
    // await dbClient.query(
    //   /*SQL*/ `SELECT contact_num FROM orders WHERE users.id = $1 `,
    //   [users]
    // ).rows[0];

    process.env.RECIPIENT_WAID!,
    "recipient token: ABC123! https://ip:8080.com"
  );

//   console.log(data);
  const resp = await sendMessage(data);
  console.log(resp.status);
  res.status(200).json({ message: "message sent!" });
}
