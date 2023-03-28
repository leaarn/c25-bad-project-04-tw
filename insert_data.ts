import path from "path";
import xlsx from "xlsx";
import { hashPassword } from "./utils/hash";
import { Client } from "pg";
import { UsersRow } from "./model";
import { DriversRow } from "./model";
import { OrdersRow } from "./model";
import { CarTypesRow } from "./model";
import { PaymentMethodRow } from "./model";
import { OrderAnimalsRow } from "./model";
import { AnimalsRow } from "./model";


import dotenv from "dotenv";
dotenv.config();



async function main() {
  const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  const filepath = path.join(__dirname,"db", "data_base.xlsx");
  const workbook = xlsx.readFile(filepath);

  const userRows = xlsx.utils.sheet_to_json<UsersRow>(workbook.Sheets["users"]);
  const driversRow = xlsx.utils.sheet_to_json<DriversRow>(
    workbook.Sheets["drivers"]
  );
  const ordersRow = xlsx.utils.sheet_to_json<OrdersRow>(
    workbook.Sheets["orders"]
  );
  const carTypesRow = xlsx.utils.sheet_to_json<CarTypesRow>(
    workbook.Sheets["car_types"]
  );
  const paymentMethodRow = xlsx.utils.sheet_to_json<PaymentMethodRow>(
    workbook.Sheets["payment_method"]
  );
  const orderAnimalsRow = xlsx.utils.sheet_to_json<OrderAnimalsRow>(
    workbook.Sheets["order_animals"]
  );
  const animalsRow = xlsx.utils.sheet_to_json<AnimalsRow>(
    workbook.Sheets["animals"]
  );

  await client.connect();
  await client.query(/*SQL*/ `DELETE FROM users`);
  for (const userRow of userRows) {
    const userSql = /*SQL*/ `INSERT INTO users (last_name, first_name, title, email, password, contact_num, default_district, default_address, default_coordinates) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    let hashed = await hashPassword(userRow.password);
    await client.query(userSql, [
      userRow.last_name,
      userRow.first_name,
      userRow.title,
      userRow.email,
      hashed,
      userRow.contact_num,
      userRow.default_district,
      userRow.default_address,
      userRow.default_coordinates,
    ]);
  }

  await client.query(/*SQL*/ `DELETE FROM drivers`);
  let driversSql = `INSERT INTO drivers (last_name, first_name, title, email, password, contact_num, car_license_num, car_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) `;
  for (let i = 0; i < driversRow.length; i++) {
    if (i < driversRow.length - 1) driversSql += `($${i + 1}),`;
    else driversSql += `($${i + 1})`;
  }
  console.log(driversSql);
  await client.query(
    driversSql,
    driversRow.map((row) => [
      row.last_name,
      row.last_name,
      row.first_name,
      row.title,
      row.email,
      row.password,
      row.contact_num,
      row.car_license_num,
      row.car_type,
    ])
  );
  await client.query(/*SQL*/ `DELETE FROM orders`);
  let ordersSql = `INSERT INTO orders (pick_up_date, pick_up_time, pick_up_district, pick_up_address, pick_up_coordinates, deliver_district, deliver_address, deliver_coordinates, distance_km, distance_price, reference_code, orders_status, token, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
  for (let i = 0; i < ordersRow.length; i++) {
    if (i < ordersRow.length - 1) ordersSql += `($${i + 1}),`;
    else ordersSql += `($${i + 1})`;
  }
  console.log(ordersSql);
  await client.query(
    ordersSql,
    ordersRow.map((row) => [
      row.pick_up_date,
      row.pick_up_time,
      row.pick_up_district,
      row.pick_up_address,
      row.pick_up_coordinates,
      row.deliver_district,
      row.deliver_address,
      row.deliver_coordinates,
      row.distance_km,
      row.distance_price,
      row.reference_code,
      row.order_status,
      row.token,
      row.remarks,
    ])
  );

  await client.query(/*SQL*/ `DELETE FROM car_types`);
  let carTypesSql = `INSERT INTO drivers (car_type) VALUES ($1)`;
  for (let i = 0; i < carTypesRow.length; i++) {
    if (i < carTypesRow.length - 1) carTypesSql += `($${i + 1}),`;
    else carTypesSql += `($${i + 1})`;
  }
  console.log(carTypesSql);
  await client.query(
    carTypesSql,
    carTypesRow.map((row) => row.car_type)
  );

  await client.query(/*SQL*/ `DELETE FROM payment_method`);
  let paymentMethodSql = `INSERT INTO drivers (method) VALUES ($1)`;
  for (let i = 0; i < paymentMethodRow.length; i++) {
    if (i < paymentMethodRow.length - 1) paymentMethodSql += `($${i + 1}),`;
    else paymentMethodSql += `($${i + 1})`;
  }
  console.log(paymentMethodSql);
  await client.query(
    paymentMethodSql,
    paymentMethodRow.map((row) => row.method)
  );

  await client.query(/*SQL*/ `DELETE FROM order_animals`);
  let orderAnimalsSql = `INSERT INTO drivers (animals_amount,animals_unit_price) VALUES ($1,$2)`;
  for (let i = 0; i < orderAnimalsRow.length; i++) {
    if (i < orderAnimalsRow.length - 1) orderAnimalsSql += `($${i + 1}),`;
    else orderAnimalsSql += `($${i + 1})`;
  }
  console.log(orderAnimalsSql);
  await client.query(
    orderAnimalsSql,
    orderAnimalsRow.map((row) => [row.animals_amount, row.animals_unit_price])
  );

  await client.query(/*SQL*/ `DELETE FROM animals`);
  let animalsSql = `INSERT INTO drivers (animals_name,price) VALUES ($1,$2)`;
  for (let i = 0; i < animalsRow.length; i++) {
    if (i < animalsRow.length - 1) animalsSql += `($${i + 1}),`;
    else animalsSql += `($${i + 1})`;
  }
  console.log(animalsSql);
  await client.query(
    animalsSql,
    animalsRow.map((row) => [row.animals_name, row.price])
  );

  await client.end();
}


main();