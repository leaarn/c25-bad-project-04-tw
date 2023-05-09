import Knex from "knex";
const knexfile = require("../knexfile");
const knex = Knex(knexfile["test2"]);
// import path from "path";
// import xlsx from "xlsx";
import { UsersMainService } from "../services/UsersMainService";
// import { UsersService } from '../services/UsersService';

describe.only("Test UsersMainServiceKnex", () => {
  let usersMainService = new UsersMainService(knex);
  let orderIds: number[];
  let usersId: number;
  beforeAll(async () => {
    // const tempPass = crypto.randomBytes(20).toString("hex");
    await knex("users").del();
    usersId = await knex("users")
      .insert([
        {
          last_name: "Kam",
          first_name: "Chinny",
          title: "Miss",
          email: "learning20150133@gmail.com",
          password: "a1234",
          contact_num: "51170071",
          default_district: "Central and Western",
          default_room: "Room 209",
          default_floor: "2/F",
          default_building: "Pacific Place",
          default_street: "88 Queensway",
        },
      ])
      .returning("id");

    console.log("eeeeeee", usersId);
  });
  it("insert orders ", async () => {
    orderIds = (
      await knex("orders")
        .insert([
          {
            pick_up_date: "2023-03-01",
            pick_up_time: "11:03",
            pick_up_district: "南區",
            pick_up_room: "203",
            pick_up_floor: "15/F",
            pick_up_building: "TML",
            pick_up_street: "street",
            deliver_district: "南區",
            deliver_room: "204",
            deliver_floor: "20/F",
            deliver_building: "TML",
            deliver_street: "street",
            users_id: usersId[0].id,
            distance_km: 90,
            receiver_name: "Mom",
            receiver_contact: "12345678",
            token: "C28A26",
            remarks: "no remarks",
            orders_status: "已完成",
          },
          {
            pick_up_date: "2023-10-01",
            pick_up_time: "12:00",
            pick_up_district: "西區",
            pick_up_room: "303",
            pick_up_floor: "18/F",
            pick_up_building: "TML",
            pick_up_street: "street",
            deliver_district: "西區",
            deliver_room: "204",
            deliver_floor: "20/F",
            deliver_building: "TML",
            deliver_street: "street",
            users_id: usersId[0].id,
            receiver_name: "Dad",
            receiver_contact: "12345678",
            token: "D11A11",
            remarks: "no remarks",
            orders_status: "not pay yet",
          },
        ])
        .returning("id")
    ).map((m) => m.id);

    console.log("insert order's id", orderIds);
  });
  it("insert order animal", async () => {
    let animals_id = [
      ["1", "2"],
      ["1", "2"],
    ];
    let animals_amount = [
      ["1", "1"],
      ["1", "1"],
    ];
    for (let i = 0; i < animals_id.length; i++) {
      for (let j = 0; j < animals_id[i].length; j++) {
        const animals_history_price = await knex("animals")
          .select("price")
          .where("id", "=", `${parseInt(animals_id[i][j])}`)
          .first();

        console.log("anm!!!!", animals_history_price);
          console.log("order id", orderIds[i]);
          const orderAnimal = await knex("order_animals").insert({
            orders_id: orderIds[i],
            animals_id: parseInt(animals_id[i][j]),
            animals_amount: parseInt(animals_amount[i][j]),
            animals_history_price: animals_history_price.price,
          });
          console.log(orderAnimal);

      }
    }
  });

  it("get userInfo", async () => {
    await usersMainService.getUserInfo(usersId[0].id);

    const getUserInfo = await knex("users")
      .select("first_name")
      .where("id", usersId[0].id)
      .first();
    console.log("check cehck", getUserInfo);
    expect(getUserInfo).toMatchObject({
      first_name: "Chinny",
    });
  });

  it("payOrderDetails", async () => {
    await usersMainService.payOrderDetails(usersId[0].id);

    const payOrderDetails = await knex("orders")
      .select(
        knex.raw(` CONCAT(pick_up_date,' ',pick_up_time) AS pick_up_date_time,
    CONCAT(pick_up_room,' ',pick_up_floor,' ',pick_up_building,' ',pick_up_street,' ',pick_up_district) AS pick_up_address,
    CONCAT(deliver_room,' ',deliver_floor,' ',deliver_building,' ',deliver_street,' ',deliver_district) AS deliver_address,
    json_agg(animals.animals_name) AS animals_name,
    json_agg(order_animals.animals_amount) AS animals_amount,
    remarks,
    max(distance_km) AS distance_km,
    orders.id, 
    max(distance_km * distance_price) AS distance_total_price,
    SUM(order_animals.animals_history_price * order_animals.animals_amount) AS animals_total_price, 
    max(distance_km * distance_price) + SUM(order_animals.animals_history_price * order_animals.animals_amount) AS total_price`)
      )
      .join("order_animals", "order_animals.orders_id", "orders.id")
      .join("animals", "animals.id", "order_animals.animals_id")
      .where("orders.orders_status", "=", "not pay yet")
      .andWhere("orders.users_id", "=", usersId[0].id)
      .groupBy(
        "remarks",
        "distance_km",
        "pick_up_date_time",
        "pick_up_address",
        "deliver_address",
        "orders.id"
      )
      .first();

    expect(payOrderDetails).toMatchObject([
      {
        pick_up_date_time: "2023-10-01 12:00:00",
        pick_up_address: "303 18/F TML street 西區",
        deliver_address: "204 20/F TML street 東區",
        animals_name: ["貓", "狗"],
        animals_amount: [1, 1],
        remarks: "no remarks",
        distance_km: 90,
        id: orderIds[1],
        distance_total_price: 900,
        animals_total_price: "80",
        total_price: "980",
      },
    ]);
  });

  // afterEach(async () => {
  //   await knex("order_animals").del();
  //   await knex("orders").del();
  //   await knex("users").del();
  // });

//   afterAll(async () => {
//     await knex("order_animals").del();
//     await knex("orders").del();
//     await knex("users").del();
//     await knex.destroy();
//   });
});
