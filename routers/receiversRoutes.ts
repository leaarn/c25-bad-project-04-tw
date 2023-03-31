import express from "express";
import dotenv from "dotenv";
import { dbClient } from "../app";
import { sendMessage, getTextMessageInput } from "./messageHelper";
import { OrdersRow } from "../model";
dotenv.config();

export const receiverRoutes = express.Router();
receiverRoutes.post("/", message);

async function message(req: express.Request, res: express.Response) {
  try {
    const usersId = req.session.users_id;

    const result = await dbClient.query<OrdersRow>(
      /*SQL*/ `SELECT receiver_contact FROM orders WHERE users_id = $1 `,
      [usersId]
    );
    const receiverContact = result.rows[0];
    console.log("receiverContact");

    // const token = await dbClient.query<OrdersRow>(
    //   /*SQL*/ `SELECT receiver_contact FROM orders WHERE users_id = $1 `,
    //   [usersId]
    // );

    const data = getTextMessageInput(
      "852" + receiverContact.receiver_contact.toString(),
      "recipient token: ABC123! https://ip:8080.com"
    );

    console.log(data);
    const resp = await sendMessage(data);
    console.log(resp.status);
    res.status(200).json({ message: "message sent!" });
  } catch (err: any) {
    console.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}
