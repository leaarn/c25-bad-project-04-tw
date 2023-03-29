// import { dbClient } from "./../app";
// import type { Request, Response, NextFunction } from "express";
import express from "express";
import path from "path";
import { logger } from "./logger";

const app = express();

//Section 1 middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//debug
app.use((req, _res, next) => {
  logger.debug(`Request - Method: ${req.method} \t Path: ${req.path}`);
  next();
});

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

app.post("/usersMain", async (req, res) => {
  const pick_up_date = req.body.date;
  const pick_up_time = req.body.time;
  // const pick_up_district = req.body.email;
  // const pick_up_room = req.body.room;
  // const pick_up_flat = req.body.flat;
  // const pick_up_building = req.body.building;
  // const pick_up_street = req.body.street;
  const pick_up_district = req.body.pickUpDistrict;
  const pick_up_address = req.body.pickUpRoom + req.body.pickUpFloor + req.body.pickUpBuilding + req.body.pickUpStreet;
  // const pick_up_coordinates =req.body.pick_up_coordinates
  const deliver_district = req.body.deliver_district;
  const deliver_address =
    req.body.deliverRoom + req.body.deliverFloor + req.body.deliverBuilding + req.body.deliverStreet;
  // const deliver_coordinates =req.body.deliver_coordinates
  const user_id = req.body.userId;
  const receiver_name = req.body.receiverName;
  const receiver_contact = req.body.receiver_contact;
  const animals_name = req.body.animalsName;
  const animals_amount = req.body.animals_amount;
  const remarks = req.body.remarks;
  logger.info(`
    ${pick_up_date},
    ${pick_up_time},
    ${pick_up_district},
    ${pick_up_address},
    ${deliver_district},
    ${deliver_address},
    ${user_id},
    ${receiver_name},
    ${receiver_contact},
    ${animals_name},
    ${animals_amount},
    ${remarks}`);
  res.status(200).json({ message: "success" });
  // await dbClient.query(/*SQL*/ `INSERT INTO orders (pick_up_date,pick_up_time,pick_up_district,pick_up_address,deliver_district,deliver_address,user_id,receiver_name,receiver_contact,animals_name,animals_amount,remarks,order_status)
  //    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,[
  //     pick_up_date,
  //     pick_up_time,
  //     pick_up_district,
  //     pick_up_address,
  //     deliver_district,
  //     deliver_address,
  //     user_id,receiver_name,
  //     receiver_contact,
  //     animals_name,
  //     animals_amount,
  //     remarks,
  //     "pending"
  //    ])
});

// Section 3
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "private", "usersPrivate")));

// Section 4
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

const PORT = 8080;
app.listen(PORT, () => {
  logger.info(`listening at http://localhost:${PORT}`);
});
