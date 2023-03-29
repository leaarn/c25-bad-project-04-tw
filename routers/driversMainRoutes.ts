import express from "express";
import type { Request, Response } from "express";
import { OrdersRow } from "../model";
import { dbClient } from "../app";
import { logger } from "../utils/logger";

export const driversMainRoutes = express.Router();

driversMainRoutes.get("/", getDistricts);
driversMainRoutes.get("/", getAllOrders);
driversMainRoutes.get("/history", getOrdersHistory);

async function getDistricts(req: Request, res: Response) {
  try {
    const getDistrictsResult = await dbClient.query<OrdersRow>(
      "SELECT pick_up_district, deliver_district FROM orders"
    );
    console.log(getDistrictsResult.rows);
    res.json(getDistrictsResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
} 

async function getAllOrders(req: Request, res: Response) {
  try {
    const getAllOrdersResult = await dbClient.query<OrdersRow>(
      "SELECT pick_up_district, deliver_district, pick_up_date, pick_up_time, animals.animals_name, order_animals.animals_amount FROM orders JOIN order_animals ON order_animals.orders_id = orders.id JOIN animals ON animals.id = order_animals.animals_id"
    );
    console.log(getAllOrdersResult.rows);
    res.json(getAllOrdersResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getOrdersHistory(req: Request, res: Response) {
  try {
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    }

    const resultQuery = await dbClient.query<OrdersRow>(
      /*sql*/ `SELECT reference_code, orders_status, pick_up_date, pick_up_time, pick_up_address, deliver_address, animals.animals_name, order_animals.animals_amount FROM orders JOIN order_animals ON order_animals.orders_id = orders.id JOIN animals ON animals.id = order_animals.animals_id WHERE orders.orders_status = 'receiver received' AND orders_id = $1`,
      [ordersId]
    );
    res.json(resultQuery.rows[0]);
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}
