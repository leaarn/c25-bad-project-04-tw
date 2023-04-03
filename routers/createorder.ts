import { dbClient } from "./../app";
import type { Request, Response } from "express";
import express from "express";
import { logger } from "../utils/logger";
// import { userIsLoggedInApi } from "../utils/guard";
// import { logger } from "../utils/logger";

export const usersMainRoutes = express.Router();
usersMainRoutes.post("/createorder", createOrder);
usersMainRoutes.get("/payorder", payOrder);
// usersMainRoutes.get("/orderStatus",  orderStatus);
// usersMainRoutes.get("/orderStatusDetails/:oid",  orderStatusDetails);
// usersMainRoutes.get("/history",  historyOrders);
// usersMainRoutes.get("/history/:oid",  historyOrderDetails);

////create order
async function createOrder(req: Request, res: Response) {
  try {
    const pick_up_date = req.body.pick_up_date;
    const pick_up_time = req.body.pick_up_time;
    const pick_up_district = req.body.pick_up_district;
    console.log(pick_up_district);
    const pick_up_room = req.body.pick_up_room;
    const pick_up_floor = req.body.pick_up_floor;
    const pick_up_building = req.body.pick_up_building;
    const pick_up_street = req.body.pick_up_street;

    // const pick_up_coordinates =req.body.pick_up_coordinates
    const deliver_district = req.body.deliver_district;
    const deliver_room = req.body.deliver_room;
    const deliver_floor = req.body.deliver_floor;
    const deliver_building = req.body.deliver_building;
    const deliver_street = req.body.deliver_street;

    // const deliver_coordinates =req.body.deliver_coordinates
    //??
    const users_id = req.session.users_id!;
    const receiver_name = req.body.receiver_name;
    const receiver_contact = req.body.receiver_contact;
    const animals_id = req.body.animals_id;
    const animals_amount = req.body.animals_amount;
    const remarks = req.body.remarks;
    const distance_km = Math.round(Math.random() * (100 - 1) + 1);
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let token = "";
    for (let i = 0; i < 2; i++) {
      const tokenGenerator = alphabet[Math.floor(Math.random() * alphabet.length)] + Math.floor(Math.random() * 99);
      token += tokenGenerator;
    }
    //   logger.info(`
    // here is logger
    // ${pick_up_date},
    // ${pick_up_time},
    // ${pick_up_district},
    // ${pick_up_room},
    // ${pick_up_floor},
    // ${pick_up_building},
    // ${deliver_street},
    // ${deliver_district},
    // ${deliver_room},
    // ${deliver_floor},
    // ${deliver_building},
    // ${deliver_street},
    // ${users_id},
    // ${receiver_name},
    // ${receiver_contact},
    // ${animals_id},
    // ${animals_amount},
    // ${remarks}`);

    const createOrderId = (
      await dbClient.query(
        /*SQL*/ `INSERT INTO orders (pick_up_date,pick_up_time,pick_up_district,pick_up_room,pick_up_floor,pick_up_building,pick_up_street,deliver_district,deliver_room ,deliver_floor,deliver_building,deliver_street,users_id,distance_km,receiver_name,receiver_contact,token,remarks)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18) RETURNING id`,
        [
          pick_up_date,
          pick_up_time,
          pick_up_district,
          pick_up_room,
          pick_up_floor,
          pick_up_building,
          pick_up_street,
          deliver_district,
          deliver_room,
          deliver_floor,
          deliver_building,
          deliver_street,
          users_id,
          distance_km,
          receiver_name,
          receiver_contact,
          token,
          remarks,
        ]
      )
    ).rows[0].id;
    console.log("here is testing", createOrderId);

    //未有加ANIMAL 和 最多5隻
    for (let i = 0; i < animals_id.length; i++) {
      const animalPrice = await dbClient.query(/*SQL*/ `SELECT price from animals where id = $1`, [
        parseInt(animals_id[i]),
      ]);
      const animals_history_price = animalPrice.rows[0].price;
      // console.log("here is anm price", animals_history_price);

      //insert table order_animals
      const orderAnimal = await dbClient.query(
        /*SQL*/ `INSERT INTO order_animals (orders_id,animals_id,animals_amount,animals_history_price)
    VALUES ($1,$2,$3,$4)`,
        [createOrderId, parseInt(animals_id[i]), parseInt(animals_amount[i]), animals_history_price]
      );
      console.log("here is order anm", orderAnimal);
    }
    res.status(200).json({ message: "success" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "failed to create order" });
  }
}

// const data = {
//   	"date":"2020-01-01",
// 	"time":"20:00",
// 	"pickUpDistrict":"Quarry_Bay",
// 	"pickUpRoom":"111",
// 	"pickUpFlat":"222",
// 	"pickUpBuilding":"333",
// 	"pickUpStreet":"4444",

// 	"deliver_district":"111",
// 	"deliverRoom":"222",
// 	"deliverFlat":"333",
// 	"deliverBuilding":"444",
// 	"deliverStreet":"555",
// 	"userId":"1",
// 	"receiverName":"aaa",
// 	"receiver_contact":"1234",
// 	"animalsName":"asda",
// 	"animals_amount":"1",
//  "remarks":"hihihi"
// }

async function payOrder(req: Request, res: Response) {
  try {
    const users_id = req.session.users_id!;
    const orderToPay = await dbClient.query(
      /*sql*/ `SELECT 
    CONCAT(pick_up_date,' ',pick_up_time) AS pick_up_date_time,
      CONCAT(pick_up_room,' ',pick_up_floor,' ',pick_up_building,' ',pick_up_street,' ',pick_up_district) AS pick_up_address,
      CONCAT(deliver_room,' ',deliver_floor,' ',deliver_building,' ',deliver_street,' ',deliver_district) AS deliver_address,
      json_agg(animals.animals_name) AS animals_name,
      json_agg(order_animals.animals_amount) AS animals_amount,
      remarks,
      distance_km,
      SUM(distance_km * distance_price) AS distance_total_price,
      SUM(order_animals.animals_history_price * order_animals.animals_amount) AS animals_total_price,
      SUM((distance_km * distance_price)+(order_animals.animals_history_price * order_animals.animals_amount)) AS total_price
      FROM orders
      JOIN order_animals ON order_animals.orders_id = orders.id
      JOIN animals ON animals.id = order_animals.animals_id
      WHERE orders_status ='not pay yet' AND order.users_id = $1
    GROUP BY remarks, distance_km`,
      [users_id]
    );
    console.log(orderToPay.rows[0]);
    res.json(orderToPay.rows[0]);
  } catch (err: any) {
    logger.error(err.message);
    res.status(500).json({ message: "internal server error" });
  }
}

// async function orderStatus(req: Request, res: Response) {
//   try{
//     const
//   }
// }

// async function orderStatusDetails(req: Request, res: Response) {
//   try{
//     const
//   }
// }

// async function historyOrders(req: Request, res: Response) {
//   try{
//     const
//   }
// }

// async function historyOrderDetails(req: Request, res: Response) {
//   try{
//     const
//   }
// }
