import path from "path";
import xlsx from "xlsx";
import { hashPassword } from "./utils/hash";

import { Client } from "pg";

import dotenv from "dotenv";
dotenv.config();

export interface UsersRow {
  last_name: string;
  first_name: string;
  title: string;
  email: string;
  password: string;
  contact_num: Number;
  default_district: string;
  default_address: string;
  default_coordinates?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DriversRow {
  last_name: string;
  first_name: string;
  title: string;
  email: string;
  password: string;
  contact_num: Number;
  car_license_num: Number;
  car_type: Number;
  created_at?: string;
  updated_at?: string;
}

export interface OrdersRow {
  pick_up_date: Date;
  pick_up_time: TimeRanges;
  pick_up_district: string;
  pick_up_address: string;
  pick_up_coordinates?: string;
  deliver_district: string;
  deliver_address: string;
  deliver_coordinates?: string;
  distance_km: Number;
  distance_price: Number;
  reference_code: string;
  order_status: string;
  token: string;
  remarks: string;
  created_at?: string;
  updated_at?: string;
}

export interface CarTypesRow {
  car_type: string;
}

export interface PaymentMethodRow {
  method: string;
}

export interface OrderAnimalsRow {
  animals_amount: Number;
  animals_unit_price: Number;
}

export interface AnimalsRow {
  animals_name: string;
  price: Number;
}

async function main() {
  const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  });

  const filepath = path.join(__dirname, "");
  const workbook = xlsx.readFile(filepath);

  const userRows = xlsx.utils.sheet_to_json<UsersRow>(workbook.Sheets["user"]);
  const driversRow = xlsx.utils.sheet_to_json<DriversRow>(
    workbook.Sheets["memo"]
  );
  const ordersRow = xlsx.utils.sheet_to_json<OrdersRow>(
    workbook.Sheets["user"]
  );
  const carTypesRow = xlsx.utils.sheet_to_json<CarTypesRow>(
    workbook.Sheets["memo"]
  );
  const paymentMethodRow = xlsx.utils.sheet_to_json<PaymentMethodRow>(
    workbook.Sheets["memo"]
  );
  const orderAnimalsRow = xlsx.utils.sheet_to_json<OrderAnimalsRow>(
    workbook.Sheets["user"]
  );
  const animalsRow = xlsx.utils.sheet_to_json<AnimalsRow>(
    workbook.Sheets["memo"]
  );

  await client.connect();

  

  await client.end();
}

main();
console.log("hi");
