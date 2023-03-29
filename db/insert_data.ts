import path from "path";
import xlsx from "xlsx";
import { hashPassword } from "../utils/hash";
import { Client } from "pg";
import { UsersRow } from "../model";
import { DriversRow } from "../model";
import { OrdersRow } from "../model";
import { PaymentMethodRow } from "../model";
import { OrderAnimalsRow } from "../model";
import { AnimalsRow } from "../model";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  const usersFile = path.join(__dirname, "users.csv");
  const users = xlsx.readFile(usersFile);

  const driversFile = path.join(__dirname, "drivers.csv");
  const drivers = xlsx.readFile(driversFile);

  const ordersFile = path.join(__dirname, "orders.csv");
  const orders = xlsx.readFile(ordersFile, {raw: true});

  const paymentMethodFile = path.join(__dirname, "payment_method.csv");
  const paymentMethod = xlsx.readFile(paymentMethodFile);

  const animalsFile = path.join(__dirname, "animals.csv");
  const animals = xlsx.readFile(animalsFile);

  const orderAnimalsFile = path.join(__dirname, "order_animals.csv");
  const order_animals = xlsx.readFile(orderAnimalsFile);

  const userRows = xlsx.utils.sheet_to_json<UsersRow>(users.Sheets["Sheet1"]);
  const driversRow = xlsx.utils.sheet_to_json<DriversRow>(
    drivers.Sheets["Sheet1"]
  );
  const ordersRow = xlsx.utils.sheet_to_json<OrdersRow>(
    orders.Sheets["Sheet1"]
  );
  const paymentMethodRow = xlsx.utils.sheet_to_json<PaymentMethodRow>(
    paymentMethod.Sheets["Sheet1"]
  );
  const orderAnimalsRow = xlsx.utils.sheet_to_json<OrderAnimalsRow>(
    order_animals.Sheets["Sheet1"]
  );
  const animalsRow = xlsx.utils.sheet_to_json<AnimalsRow>(
    animals.Sheets["Sheet1"]
  );

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
    const driverSql = `INSERT INTO drivers (last_name, first_name, title, email, password, contact_num, car_license_num, car_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    let hashed2 = await hashPassword(driverRow.password);
    await client.query(driverSql, [
      driverRow.last_name,
      driverRow.first_name,
      driverRow.title,
      driverRow.email,
      hashed2,
      driverRow.contact_num,
      driverRow.car_license_num,
      driverRow.car_type,
    ]);
  }

  await client.query(/*SQL*/ `DELETE FROM animals`);
  for (const animalRow of animalsRow) {
    let animalsSql = /*SQL*/ `INSERT INTO animals (animals_name,price) VALUES ($1,$2)`;
    await client.query(animalsSql, [animalRow.animals_name, animalRow.price]);
  }

  await client.query(/*SQL*/ `DELETE FROM orders`);
  for (const orderRow of ordersRow) {
    let ordersSql = /*SQL*/ `INSERT INTO orders (pick_up_date, pick_up_time, pick_up_district, pick_up_address, pick_up_coordinates, deliver_district, deliver_address, deliver_coordinates, users_id, drivers_id, receiver_name, receiver_contact, distance_km, distance_price, reference_code, orders_status, token, remarks) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)`;
    await client.query(ordersSql, [
      orderRow.pick_up_date,
      orderRow.pick_up_time,
      orderRow.pick_up_district,
      orderRow.pick_up_address,
      orderRow.pick_up_coordinates,
      orderRow.deliver_district,
      orderRow.deliver_address,
      orderRow.deliver_coordinates,
      orderRow.users_id,
      orderRow.drivers_id,
      orderRow.receiver_name,
      orderRow.receiver_contact,
      orderRow.distance_km,
      orderRow.distance_price,
      orderRow.reference_code,
      orderRow.orders_status,
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
    let orderAnimalsSql = /*SQL*/ `INSERT INTO order_animals (orders_id, animals_id, animals_amount,animals_history_price) VALUES ($1,$2,$3,$4)`;
    await client.query(orderAnimalsSql, [
      orderAnimalRow.orders_id,
      orderAnimalRow.animals_id,
      orderAnimalRow.animals_amount,
      orderAnimalRow.animals_history_price,
    ]);
  }

  await client.end();
}

main();
