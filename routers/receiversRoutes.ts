import express from "express";
import dotenv from "dotenv";
import { dbClient } from "../app";
import { sendMessage, getTextMessageInput } from "./messageHelper";
import { OrdersRow } from "../model";
import { logger } from "../utils/logger";
dotenv.config();

export const receiverRoutes = express.Router();
receiverRoutes.post("/", message);
receiverRoutes.post("/token", checkToken);

async function message(req: express.Request, res: express.Response) {
  try {
    const usersId = req.session.users_id;

    const result = await dbClient.query<OrdersRow>(
      /*SQL*/ `SELECT receiver_contact FROM orders WHERE users_id = $1 `,
      [usersId]
    );
    const receiverContact = result.rows[0];

    const tokenResult = await dbClient.query<OrdersRow>(
      /*SQL*/ `SELECT token FROM orders WHERE users_id = $1 `,
      [usersId]
    );
    const token = tokenResult.rows[0];

    const data = getTextMessageInput(
      "852" + receiverContact.receiver_contact.toString(),
      `Here is your receiver token: ${JSON.stringify(
        Object.values(token)
      )} http://localhost:8080/receivers.html`
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

async function checkToken(req: express.Request, res: express.Response) {
  try {
    const token: string = req.body.token;

    const queryResult = await dbClient.query<OrdersRow>(
      /*SQL*/ `SELECT id, token FROM orders`
    );
    const foundToken = queryResult.rows[0];
    console.log(foundToken)

    if (!token) {
      res.status(400).json({ message: "missing token!" });
      return;
    }
    if (!foundToken) {
      res.status(400).json({ message: "invalid token! " });
      return;
    } else {
      // const receiveStatus = 
      await dbClient.query<OrdersRow>(
        /*SQL*/ `UPDATE orders SET orders_status = 'receiver received' WHERE token = $1 `,
        [token]
      );
      // receiveStatus.rows[0];
      res.status(200).json({ message: "successful!" });
    }
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}
