import { Knex } from "knex";
import path from "path";
import xlsx from "xlsx";
import { hashPassword } from "../utils/hash";
import {
  // UsersRow,
  DriversRow,
  PaymentMethodRow,
  OrderAnimalsRow,
} from "../model";
import {
  userTable,
  driverTable,
  orderTable,
  paymentTable,
  orderAnimalTable,
} from "../migrations/20230503035349_init-db";
import fs from "fs";

export async function seed(knex: Knex): Promise<void> {
  // const usersFile = path.join(__dirname, "..", "db", "users.csv");
  // const users = xlsx.readFile(usersFile);

  const driversFile = path.join(__dirname, "..", "db", "drivers.csv");
  const drivers = xlsx.readFile(driversFile);

  const paymentMethodFile = path.join(
    __dirname,
    "..",
    "db",
    "payment_method.csv"
  );
  const paymentMethod = xlsx.readFile(paymentMethodFile);

  const orderAnimalsFile = path.join(
    __dirname,
    "..",
    "db",
    "order_animals.csv"
  );
  const order_animals = xlsx.readFile(orderAnimalsFile);

  // const userRows = xlsx.utils.sheet_to_json<UsersRow>(users.Sheets["Sheet1"]);
  const driverRows = xlsx.utils.sheet_to_json<DriversRow>(
    drivers.Sheets["Sheet1"]
  );

  const paymentMethodRow = xlsx.utils.sheet_to_json<PaymentMethodRow>(
    paymentMethod.Sheets["Sheet1"]
  );
  const orderAnimalsRow = xlsx.utils.sheet_to_json<OrderAnimalsRow>(
    order_animals.Sheets["Sheet1"]
  );
  // Deletes ALL existing entries
  await knex(orderAnimalTable).del();
  // await knex(animalTable).del();
  await knex(paymentTable).del();
  await knex(orderTable).del();
  await knex(driverTable).del();
  await knex(userTable).del();

  // const insertUserRows = await Promise.all(
  //   userRows.map(async (row) => ({
  //     last_name: row.last_name,
  //     first_name: row.first_name,
  //     title: row.title,
  //     email: row.email,
  //     password: await hashPassword(row.password),
  //     contact_num: row.contact_num,
  //     default_district: row.default_district,
  //     default_room: row.default_room,
  //     default_floor: row.default_floor,
  //     default_building: row.default_building,
  //     default_street: row.default_street,
  //     default_coordinates: row.default_coordinates,
  //   }))
  // );
  // // Inserts seed entries
  // await knex(userTable).insert(insertUserRows);

  let usersArray = fs
    .readFileSync(path.join(__dirname, "..", "db", "users.csv"))
    .toString()
    .replace(/(?:\\[rn]|[\r]+)+/g, "")
    .split("\n");

  for (let i = 1; i < usersArray.length; i++) {
    const user = usersArray[i].split(",");
    await knex(userTable).insert({
      last_name: user[0],
      first_name: user[1],
      title: user[2],
      email: user[3],
      password: await hashPassword(user[4]),
      contact_num: user[5],
      default_district: user[6],
      default_room: user[7],
      default_floor: user[8],
      default_building: user[9],
      default_street: user[10],
      default_coordinates: user[11],
    });
  }

  const insertDriverRows = await Promise.all(
    driverRows.map(async (row) => ({
      last_name: row.last_name,
      first_name: row.first_name,
      title: row.title,
      email: row.email,
      password: await hashPassword(row.password),
      contact_num: row.contact_num,
      car_license_num: row.car_license_num,
      car_type: row.car_type,
    }))
  );
  // Inserts seed entries
  await knex(driverTable).insert(insertDriverRows);

  let ordersArray = fs
    .readFileSync(path.join(__dirname, "..", "db", "orders.csv"))
    .toString()
    .replace(/(?:\\[rn]|[\r]+)+/g, "")
    .split("\n");

  for (let i = 1; i < ordersArray.length; i++) {
    const order = ordersArray[i].split(",");
    order.forEach((v, i) => console.log(`${i}: ${v}`));
    const data = order[15]
      ? {
          pick_up_date: order[0],
          pick_up_time: order[1],
          pick_up_district: order[2],
          pick_up_room: order[3],
          pick_up_floor: order[4],
          pick_up_building: order[5],
          pick_up_street: order[6],
          pick_up_coordinates: order[7],
          deliver_district: order[8],
          deliver_room: order[9],
          deliver_floor: order[10],
          deliver_building: order[11],
          deliver_street: order[12],
          deliver_coordinates: order[13],
          users_id: order[14],
          drivers_id: order[15],
          receiver_name: order[16],
          receiver_contact: order[17],
          distance_km: order[18],
          distance_price: order[19],
          reference_code: order[20],
          orders_status: order[21],
          token: order[22],
          remarks: order[23],
          created_at: order[24],
        }
      : {
          pick_up_date: order[0],
          pick_up_time: order[1],
          pick_up_district: order[2],
          pick_up_room: order[3],
          pick_up_floor: order[4],
          pick_up_building: order[5],
          pick_up_street: order[6],
          pick_up_coordinates: order[7],
          deliver_district: order[8],
          deliver_room: order[9],
          deliver_floor: order[10],
          deliver_building: order[11],
          deliver_street: order[12],
          deliver_coordinates: order[13],
          users_id: order[14],
          receiver_name: order[16],
          receiver_contact: order[17],
          distance_km: order[18],
          distance_price: order[19],
          reference_code: order[20],
          orders_status: order[21],
          token: order[22],
          remarks: order[23],
          created_at: order[24],
        };
    await knex(orderTable).insert(data);
  }

  await knex(paymentTable).insert(paymentMethodRow);

  // let animalsArray = fs
  //   .readFileSync(path.join(__dirname, "..", "db", "animals.csv"))
  //   .toString()
  //   .replace(/(?:\\[rn]|[\r]+)+/g, "")
  //   .split("\n");

  // for (let i = 1; i < animalsArray.length; i++) {
  //   const animal = animalsArray[i].split(",");
  //   await knex(animalTable).insert({
  //     animals_name: animal[0],
  //     price: animal[1],
  //   });
  // }

  await knex(orderAnimalTable).insert(orderAnimalsRow);
}
