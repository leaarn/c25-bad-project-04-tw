import { dbClient } from "./../app";
import type { Request, Response } from "express";
import express from "express";

import { userIsLoggedInApi } from "../utils/guard";

export const createOrderRoutes = express.Router();
createOrderRoutes.post("/", userIsLoggedInApi, createOrder);

async function createOrder(req: Request, res: Response) {
  const pick_up_date = req.body.date;
  const pick_up_time = req.body.time;
  const pick_up_district = req.body.pickUpDistrict;
  const pick_up_address =
    req.body.pickUpRoom + ", " + req.body.pickUpFloor + ", " + req.body.pickUpBuilding + ", " + req.body.pickUpStreet;
  // const pick_up_coordinates =req.body.pick_up_coordinates
  const deliver_district = req.body.deliver_district;
  const deliver_address =
    req.body.deliverRoom +
    ", " +
    req.body.deliverFloor +
    ", " +
    req.body.deliverBuilding +
    ", " +
    req.body.deliverStreet;
  // const deliver_coordinates =req.body.deliver_coordinates
  const users_id = req.session.users_id!;
  const receiver_name = req.body.receiverName;
  const receiver_contact = req.body.receiver_contact;
  const animals_id = req.body.animalsName;
  const animals_amount = req.body.animals_amount;
  const remarks = req.body.remarks;
  res.status(200).json({ message: "success" });

  const createOrderId = (
    await dbClient.query(
      /*SQL*/ `INSERT INTO orders (pick_up_date,pick_up_time,pick_up_district,pick_up_address,deliver_district,deliver_address,users_id,receiver_name,receiver_contact,remarks)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`,
      [
        pick_up_date,
        pick_up_time,
        pick_up_district,
        pick_up_address,
        deliver_district,
        deliver_address,
        users_id,
        receiver_name,
        receiver_contact,
        remarks,
      ]
    )
  ).rows[0].id;
  console.log("here is testing", createOrderId);

  //未有加ANIMAL 和 最多5隻
  const animalPrice = await dbClient.query(/*SQL*/ `SELECT price from animals where id = $1`, [animals_id]);
  const animals_history_price = animalPrice.rows[0].price;
  // console.log("here is anm price", animals_history_price);

  //insert table order_animals
  const orderAnimal = await dbClient.query(
    /*SQL*/ `INSERT INTO order_animals (orders_id,animals_id,animals_amount,animals_history_price)
    VALUES ($1,$2,$3,$4)`,
    [createOrderId, animals_id, animals_amount, animals_history_price]
  );
  console.log("here is order anm", orderAnimal);
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

// logger.info(`
// here is logger
// ${pick_up_date},
// ${pick_up_time},
// ${pick_up_district},
// ${pick_up_address},
// ${deliver_district},
// ${deliver_address},
// ${users_id},
// ${receiver_name},
// ${receiver_contact},
// ${animals_id},
// ${animals_amount},
// ${remarks}`);
