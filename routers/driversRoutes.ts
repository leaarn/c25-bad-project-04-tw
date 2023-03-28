import express from "express";
import type { Request, Response } from "express";
import { OrdersRow, OrderAnimalsRow } from "../model";
import { dbClient } from "../app";

export const driversRoutes = express.Router();

driversRoutes.get("/", getDistricts);
driversRoutes.get("/", getAllOrders);
driversRoutes.put ("/", getAllOrders);

async function getDistricts(req: Request, res: Response) {
  const queryResult = await dbClient.query<OrdersRow>(
    "SELECT pick_up_district, deliver_district FROM orders"
  );
  console.log(queryResult.rows);
  res.json(queryResult.rows); // pass array into res.json()
}

async function getAllOrders(req: Request, res: Response) {
  const queryResult = await dbClient.query<OrdersRow>(
    "SELECT pick_up_district, deliver_district, pick_up_date, pick_up_time, animals.animals_name, order_animals.animals_amount FROM orders JOIN order_animals ON order_animals.orders_id = orders.id JOIN animals ON animals.id = order_animals.animals_id"
  );
  console.log(queryResult.rows);
  res.json(queryResult.rows); // pass array into res.json()
}

async function updateOrders(req: Request, res: Response) {
    const memoId = +req.params.mid;
    const newContent = req.body.content;
  
    if (isNaN(memoId)) {
      res.status(400).json({ message: "invalid memo id" });
      return;
    }
  
    await dbClient.query(/*SQL*/ `UPDATE memos SET content = $1 WHERE id = $2`, [newContent, memoId]);
    res.json({ message: "success" });
  }

