import express from "express";
import type { Request, Response } from "express";
import { DriversRow, OrdersRow } from "../model";
import { dbClient } from "../app";
import { logger } from "../utils/logger";
import { driverIsLoggedInApi } from "../utils/guard";

export const driversMainRoutes = express.Router();

driversMainRoutes.get("/", driverIsLoggedInApi); 
driversMainRoutes.get("/get-driver-info", driverIsLoggedInApi, getDriverInfo); 
driversMainRoutes.get("/get-district", driverIsLoggedInApi, getDistricts);
driversMainRoutes.get("/get-orders", driverIsLoggedInApi, getAllOrders);
driversMainRoutes.get("/get-orders/:oid", driverIsLoggedInApi, getAcceptOrders);
driversMainRoutes.get("/driver-earns/:oid", driverIsLoggedInApi, driverEarns);
driversMainRoutes.get("/history", driverIsLoggedInApi, getOrdersHistory);
driversMainRoutes.get("/history/:oid", driverIsLoggedInApi, getSingleHistory);
driversMainRoutes.get("/ongoing", driverIsLoggedInApi, getOngoingOrders);
driversMainRoutes.put("/get-orders/:oid", driverIsLoggedInApi, confirmAcceptOrder);
driversMainRoutes.put("/ongoing/:oid", driverIsLoggedInApi, driverDelivering);
 
async function getDriverInfo(req: Request, res: Response) {
  try {
    const driversID = req.session.drivers_id;

    const getDriverNameResult = await dbClient.query<DriversRow>(/*sql*/
      `SELECT first_name FROM drivers WHERE id = $1`, [driversID]
    );
    console.log(getDriverNameResult);
    res.json(getDriverNameResult.rows[0]); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getDistricts(req: Request, res: Response) {
  try {
    const getDistrictsResult = await dbClient.query<OrdersRow>(/*sql*/
      `SELECT pick_up_district, deliver_district FROM orders WHERE orders_status = 'pending'`
    );
    console.log(getDistrictsResult.rows);
    res.json(getDistrictsResult.rows[0]); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getAllOrders(req: Request, res: Response) {
  try {
    const getAllOrdersResult = await dbClient.query<OrdersRow>(/*sql*/
      `SELECT pick_up_district, deliver_district, pick_up_date, pick_up_time, animals.animals_name, order_animals.animals_amount FROM orders JOIN order_animals ON order_animals.orders_id = orders.id JOIN animals ON animals.id = order_animals.animals_id WHERE orders.orders_status = 'pending'`
    );
    console.log(getAllOrdersResult.rows);
    res.json(getAllOrdersResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getAcceptOrders(req: Request, res: Response) { 
  try {
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    }
    const getAcceptOrdersResult = await dbClient.query<OrdersRow>(/*sql*/
      `SELECT CONCAT(users.title, ' ', users.first_name, ' ', users.last_name) AS user_full_name, 
      users.contact_num, 
      CONCAT(pick_up_date, ' ', pick_up_time) AS pick_up_date_time, 
      CONCAT(pick_up_room, ' ', pick_up_floor, ' ', pick_up_building, ' ', pick_up_street, ' ', pick_up_district) AS pick_up_address, 
      CONCAT(deliver_room, ' ', deliver_floor, ' ', deliver_building, ' ', deliver_street, ' ', deliver_district) AS deliver_address, 
      json_agg(animals.animals_name) AS animals_name, 
      json_agg(order_animals.animals_amount) AS animals_amount, 
      remarks, orders_status 
      FROM orders 
      JOIN users ON orders.users_id = users.id
      JOIN order_animals ON order_animals.orders_id = orders.id 
      JOIN animals ON animals.id = order_animals.animals_id
      WHERE orders_status = 'pending' AND orders.id = $1
      GROUP BY user_full_name, contact_num, pick_up_date_time, pick_up_address, deliver_address, remarks, orders_status
      `, [ordersId]
    );
    console.log(getAcceptOrdersResult.rows);
    res.json(getAcceptOrdersResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function driverEarns (req: Request, res: Response) {
  try {
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    }
    const driverEarnsResult = await dbClient.query<OrdersRow>(/*sql*/
      `SELECT distance_km, 
      SUM(distance_km * distance_price) AS distance_total_price, 
      json_agg(animals.animals_name) AS animals_name,
      json_agg(order_animals.animals_amount) AS animals_amount,
      SUM(order_animals.animals_history_price * order_animals.animals_amount) AS animals_total_price, 
      SUM(distance_km * distance_price + order_animals.animals_history_price * order_animals.animals_amount) AS total_price,
      SUM((distance_km * distance_price + order_animals.animals_history_price * order_animals.animals_amount) * 0.2) AS platform_fee,
      SUM((distance_km * distance_price + order_animals.animals_history_price * order_animals.animals_amount) - ((distance_km * distance_price + order_animals.animals_history_price * order_animals.animals_amount) * 0.2)) AS driver_earns
      FROM orders 
      JOIN users ON orders.users_id = users.id
      JOIN order_animals ON order_animals.orders_id = orders.id 
      JOIN animals ON animals.id = order_animals.animals_id
      WHERE orders_status = 'pending' AND orders.id = $1
      GROUP BY distance_km`, [ordersId]
    );
    console.log(driverEarnsResult.rows);
    res.json(driverEarnsResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getOrdersHistory(req: Request, res: Response) {
  try {
    const driversID = req.session.drivers_id!;

    const getAllHistoryResult = await dbClient.query<OrdersRow>(/*sql*/
      `SELECT reference_code, orders_status, pick_up_date, pick_up_time, pick_up_room, pick_up_floor, pick_up_building, pick_up_street, deliver_room, deliver_floor,deliver_building, deliver_street, animals.animals_name, order_animals.animals_amount FROM orders JOIN order_animals ON order_animals.orders_id = orders.id JOIN animals ON animals.id = order_animals.animals_id WHERE orders.orders_status = 'receiver received' AND orders.drivers_id = $1`,
      [driversID]
    );

    console.log(getAllHistoryResult.rows);
    res.json(getAllHistoryResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getSingleHistory(req: Request, res: Response) {
  try {
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    } 

    const getSingleQuery = await dbClient.query<OrdersRow>(
      /*sql*/ `SELECT reference_code, orders_status, pick_up_date, pick_up_time, pick_up_room, pick_up_floor, pick_up_building, pick_up_street,deliver_room,deliver_floor,deliver_building, deliver_street, animals.animals_name, order_animals.animals_amount FROM orders JOIN order_animals ON order_animals.orders_id = orders.id JOIN animals ON animals.id = order_animals.animals_id WHERE orders.orders_status = 'receiver received' AND orders_id = $1`,
      [ordersId]
    );
    console.log(getSingleQuery.rows);
    res.json(getSingleQuery.rows[0]);
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function getOngoingOrders(req: Request, res: Response) {
  try {
    const driversID = req.session.drivers_id!;
    // const ordersId = +req.params.oid;
    // if (isNaN(ordersId)) {
    //   res.status(400).json({ message: "invalid order id" });
    //   return;
    // }
    const getOngoingOrdersResult = await dbClient.query<OrdersRow>(/*sql*/
      `SELECT orders.id, reference_code, 
      CONCAT(users.title, ' ', users.first_name, ' ', users.last_name) AS user_full_name, 
      users.contact_num, 
      CONCAT(pick_up_date, ' ', pick_up_time) AS pick_up_date_time, 
      CONCAT(pick_up_room, ' ', pick_up_floor, ' ', pick_up_building, ' ', pick_up_street, ' ', pick_up_district) AS pick_up_address, 
      CONCAT(deliver_room, ' ', deliver_floor, ' ', deliver_building, ' ', deliver_street, ' ', deliver_district) AS deliver_address, 
      json_agg(animals.animals_name) AS animals_name, 
      json_agg(order_animals.animals_amount) AS animals_amount, 
      remarks, orders_status
      FROM orders 
      JOIN users ON orders.users_id = users.id
      JOIN order_animals ON order_animals.orders_id = orders.id 
      JOIN animals ON animals.id = order_animals.animals_id
      WHERE orders_status = 'driver accepts' OR orders_status = 'driver delivering' AND drivers_id = $1
      GROUP BY orders.id, reference_code, user_full_name, contact_num, pick_up_date_time, pick_up_address, deliver_address, remarks
      `, [driversID]
    );
    console.log(getOngoingOrdersResult.rows);
    res.json(getOngoingOrdersResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function driverDelivering(req: Request, res: Response) {
  try {
    const driversID = req.session.drivers_id!;
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    }
    const driverDeliveringResult = await dbClient.query<OrdersRow>(/*sql*/
      `UPDATE orders SET orders_status = 'driver delivering'
      WHERE orders_status = 'driver accepts' AND orders.id = $1 AND drivers_id = $2
      `, [ordersId, driversID]
    );
    console.log(driverDeliveringResult.rows);
    res.json(driverDeliveringResult.rows); // pass array into res.json()
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

async function confirmAcceptOrder(req: Request, res: Response) {
  try {
    const ordersId = +req.params.oid;
    if (isNaN(ordersId)) {
      res.status(400).json({ message: "invalid order id" });
      return;
    }
    const confirmAcceptOrderResult = await dbClient.query<OrdersRow>(/*sql*/
      `UPDATE orders SET orders_status = 'driver accepts'
      WHERE orders_status = 'pending' AND orders.id = $1
      `, [ordersId]
    );
    console.log(confirmAcceptOrderResult.rows);
    res.json(confirmAcceptOrderResult.rows); // pass array into res.json()
    res.redirect("/")
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}