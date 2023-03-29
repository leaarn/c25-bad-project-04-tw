import express from "express";
import type { Request, Response } from "express";
import { OrdersRow } from "../model";
import { dbClient } from "../app";
import { logger } from "../utils/logger";

export const driversRoutes = express.Router();

driversRoutes.get("/", getDistricts);
driversRoutes.get("/", getAllOrders);
// driversRoutes.get("/", "/history", getOrdersHistory);

async function getDistricts(req: Request, res: Response) {
  try {
    const queryResult = await dbClient.query<OrdersRow>(
      "SELECT pick_up_district, deliver_district FROM orders"
    );
    console.log(queryResult.rows);
    res.json(queryResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getAllOrders(req: Request, res: Response) {
  try {
    const queryResult = await dbClient.query<OrdersRow>(
      "SELECT pick_up_district, deliver_district, pick_up_date, pick_up_time, animals.animals_name, order_animals.animals_amount FROM orders JOIN order_animals ON order_animals.orders_id = orders.id JOIN animals ON animals.id = order_animals.animals_id"
    );
    console.log(queryResult.rows);
    res.json(queryResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

// async function getOrdersHistory(req: Request, res: Response) {
//   try {
//     const queryResult = await dbClient.query<OrdersRow>(
//       `SELECT reference_code, orders_status, pick_up_date, pick_up_time, pick_up_address, deliver_address, animals.animals_name, order_animals.animals_amount FROM orders JOIN order_animals ON order_animals.orders_id = orders.id JOIN animals ON animals.id = order_animals.animals_id WHERE orders.orders_status = $1`, [orders_status]
//     );
//     console.log(queryResult.rows);
//     res.json(queryResult.rows); // pass array into res.json()
//   } catch (err: any) {
//     logger.error(err.message);
//     res.status(500).json({ message: "internal server error" });
//   }
// }

// async function getOrdersHistory(req: Request, res: Response) {
//   try {
//     const ordersId = +req.params.oid;
//     if (isNaN(ordersId)) {
//       res.status(400).json({ message: "invalid order id" });
//       return;
//     }

//     const resultQuery = await dbClient.query<OrdersRow>(
//       /*sql*/ "SELECT reference_code, orders_status, pick_up_date, pick_up_time, pick_up_address, deliver_address, animals.animals_name, order_animals.animals_amount FROM orders JOIN order_animals ON order_animals.orders_id = orders.id JOIN animals ON animals.id = order_animals.animals_id WHERE orders.orders_status = $1",
//       [orders_status]
//     );
//     res.json(resultQuery.rows[0]);
//   } catch (err: any) {
//     logger.error(err.message);
//     res.status(500).json({ message: "internal server error" });
//   }
// }
