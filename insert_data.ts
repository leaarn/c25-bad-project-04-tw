import path from "path";
import xlsx from "xlsx";
import { hashPassword } from "./utils/hash";
import { Client } from "pg";
import { UsersRow } from "./model";
import { DriversRow } from "./model";
import { OrdersRow } from "./model";
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

  const filepath = path.join(__dirname, "db", "data_base.xlsx");
  const workbook = xlsx.readFile(filepath);

  const userRows = xlsx.utils.sheet_to_json<UsersRow>(workbook.Sheets["users"]);
  const driversRow = xlsx.utils.sheet_to_json<DriversRow>(workbook.Sheets["drivers"]);
  const ordersRow = xlsx.utils.sheet_to_json<OrdersRow>(workbook.Sheets["orders"]);
  const paymentMethodRow = xlsx.utils.sheet_to_json<PaymentMethodRow>(workbook.Sheets["payment_method"]);
  const orderAnimalsRow = xlsx.utils.sheet_to_json<OrderAnimalsRow>(workbook.Sheets["order_animals"]);
  const animalsRow = xlsx.utils.sheet_to_json<AnimalsRow>(workbook.Sheets["animals"]);

  await client.connect();

  // await client.query(/*SQL*/ `DELETE FROM users`);
  for (const userRow of userRows) {
    const userSql = /*SQL*/ `
      INSERT INTO users 
      (last_name, first_name, title, email, password, contact_num, default_district, default_address, default_coordinates) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
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
  for (const driverRow of driversRow) {
    let driversSql = `INSERT INTO drivers (last_name, first_name, title, email, password, contact_num, car_license_num, car_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    await client.query(driversSql, [
      driverRow.last_name,
      driverRow.first_name,
      driverRow.title,
      driverRow.email,
      driverRow.password,
      driverRow.contact_num,
      driverRow.car_license_num,
      driverRow.car_type,
    ]);
  }

  await client.query(/*SQL*/ `DELETE FROM orders`);
  for (const orderRow of ordersRow) {
    let ordersSql = /*SQL*/ `INSERT INTO orders (pick_up_date, pick_up_time, pick_up_district, pick_up_address, pick_up_coordinates, deliver_district, deliver_address, deliver_coordinates, distance_km, distance_price, reference_code, orders_status, token, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
    await client.query(ordersSql, [
      orderRow.pick_up_date,
      orderRow.pick_up_time,
      orderRow.pick_up_district,
      orderRow.pick_up_address,
      orderRow.pick_up_coordinates,
      orderRow.deliver_district,
      orderRow.deliver_address,
      orderRow.deliver_coordinates,
      orderRow.distance_km,
      orderRow.distance_price,
      orderRow.reference_code,
      orderRow.order_status,
      orderRow.token,
      orderRow.remarks,
    ]);
  }

  await client.query(/*SQL*/ `DELETE FROM payment_method`);
  for (const paymentRow of paymentMethodRow) {
    let paymentMethodSql = /*SQL*/ `INSERT INTO payment_method (method) VALUES ($1)`;
    await client.query(paymentMethodSql, [paymentRow.method]);
  }

  await client.query(/*SQL*/ `DELETE FROM order_animals`);
  for (const orderAnimalRow of orderAnimalsRow) {
    let orderAnimalsSql = /*SQL*/ `INSERT INTO order_animals (animals_amount,animals_unit_price) VALUES ($1,$2)`;
    await client.query(orderAnimalsSql, [orderAnimalRow.animals_amount, orderAnimalRow.animals_unit_price]);
  }

  await client.query(/*SQL*/ `DELETE FROM animals`);
  for (const animalRow of animalsRow) {
    let animalsSql = /*SQL*/ `INSERT INTO animals (animals_name,price) VALUES ($1,$2)`;
    await client.query(animalsSql, [animalRow.animals_name, animalRow.price]);
  }
  await client.end();
}

main();
