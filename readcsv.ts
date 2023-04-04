import fs from "fs";
import path from "path";
import { dbClient } from "./app";

const buffer = fs.readFileSync(path.join(__dirname, "db", "orders.csv"));
let data = buffer.toString();
let dataArray = data.replace(/(?:\\[rn]|[\r]+)+/g, "").split("\n");
// console.log(dataArray);

async function insertDB() {
  for (let i = 1; i < dataArray.length; i++) {
    // const elem = dataArray[i].split(',')
    // console.log(elem)
    await dbClient.query(
      `
            INSERT INTO orders
            ( pick_up_date,
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
                drivers_id,
                receiver_name,
                receiver_contact,
                distance_km,
                distance_price,
                reference_code,
                orders_status,
                token,
                remarks,
                created_at)
            values
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18, $19,
            $20, $21, $22, $23 )
            
        `,
      dataArray[i].split(",").map((v) => {
        console.log(v);
        return v.toString();
      })
    );
  }
}
insertDB();
