import Knex from "knex";

import { DriversMainService } from "../../services/DriversMainService";
import {
  animalTable,
  driverTable,
  orderAnimalTable,
  orderTable,
  userTable,
} from "../../migrations/20230503035349_init-db";

import dotenv from "dotenv"
dotenv.config()

import config from "../../knexfile";
const knex = Knex(config[process.env.NODE_ENV || "development"]);

console.log("hhihihihihihi knex NODE ENV",process.env.NODE_ENV)

describe("test DriversMainServiceKnex", () => {
  let driversMainService = new DriversMainService(knex);
  let orderIds: number[];
  let driverID: { id: number }[];
  let userID: { id: number }[];

  beforeAll(async () => {
    userID = await knex(userTable)
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

    driverID = await knex(driverTable)
      .insert([
        {
          last_name: "Kam",
          first_name: "Chinny",
          title: "Miss",
          email: "l0150133@gmail.com",
          password: "a1234",
          contact_num: "51170071",
          car_license_num: "QWE123",
          car_type: "Van",
        },
      ])
      .returning("id");
  });

  beforeEach(async () => {
    orderIds = (
      await knex(orderTable)
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
            users_id: userID[0].id,
            distance_km: 90,
            distance_price: 10,
            reference_code: "0753cde0-350c-4131-a276-13a30962acbf",
            receiver_name: "Mom",
            receiver_contact: "12345678",
            remarks: "no remarks",
            orders_status: "訂單待接中",
          },
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
            users_id: userID[0].id,
            drivers_id: driverID[0].id,
            distance_km: 90,
            distance_price: 10,
            reference_code: "0753cde0-350c-4131-a276-13a30962acbf",
            receiver_name: "Mom",
            receiver_contact: "12345678",
            remarks: "no remarks",
            orders_status: "司機已接單",
          },
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
            users_id: userID[0].id,
            drivers_id: driverID[0].id,
            distance_km: 90,
            distance_price: 10,
            reference_code: "0753cde0-350c-4131-a276-13a30962acbf",
            receiver_name: "Mom",
            receiver_contact: "12345678",
            remarks: "no remarks",
            orders_status: "送貨中",
          },
          {
            pick_up_date: "2023-03-02",
            pick_up_time: "11:02",
            pick_up_district: "南區",
            pick_up_room: "204",
            pick_up_floor: "15/F",
            pick_up_building: "TML",
            pick_up_street: "street",
            deliver_district: "南區",
            deliver_room: "205",
            deliver_floor: "20/F",
            deliver_building: "TML",
            deliver_street: "street",
            users_id: userID[0].id,
            drivers_id: driverID[0].id,
            distance_km: 80,
            distance_price: 10,
            reference_code: "6eac846d-763d-4552-8fbc-54464015d109",
            receiver_name: "mary",
            receiver_contact: "12345678",
            remarks: "hihihi",
            orders_status: "已完成",
          },
        ])
        .returning("id")
    ).map((m) => m.id);

    let animals_id = [
      ["1", "2"],
      ["1", "2"],
      ["1", "2"],
      ["1", "2"],
    ];
    let animals_amount = [
      ["1", "1"],
      ["1", "1"],
      ["1", "1"],
      ["1", "1"],
    ];
    for (let i = 0; i < animals_id.length; i++) {
      for (let j = 0; j < animals_id[i].length; j++) {
        const animals_history_price = await knex(animalTable)
          .select("price")
          .where("id", "=", `${parseInt(animals_id[i][j])}`)
          .first();

        await knex(orderAnimalTable).insert({
          orders_id: orderIds[i],
          animals_id: parseInt(animals_id[i][j]),
          animals_amount: parseInt(animals_amount[i][j]),
          animals_history_price: animals_history_price.price,
        });
      }
    }
  });

  test("get driver info", async () => {
    const getDriverInfo = await driversMainService.getDriverInfo(
      driverID[0].id
    );

    expect(getDriverInfo).toMatchObject({ first_name: "Chinny" });
  });

  test("get all district", async () => {
    const getDistricts = await driversMainService.getDistricts();

    expect(getDistricts).toMatchObject([
      {
        pick_up_district: "南區",
        deliver_district: "南區",
      },
    ]);
  });

  test("get all orders", async () => {
    const getAllOrders = await driversMainService.getAllOrders();
    expect(getAllOrders.length).toBe(1)
    // expect(getAllOrders).toMatchObject([
    //   {
    //     id: orderIds[0],
    //     pick_up_district: "南區",
    //     deliver_district: "南區",
    //     pick_up_date: new Date("2023-02-28T16:00:00.000Z"),
    //     pick_up_time: "11:03:00",
    //     animals_name: ["貓", "狗"],
    //     animals_amount: [1, 1],
    //     orders_status: "訂單待接中",
    //   },
    // ]);
  });

  test("get accept orders", async () => {
    const getAcceptOrders = await driversMainService.getAcceptOrders(
      orderIds[0]
    );
    const getAcceptOrdersResult = getAcceptOrders.rows;

    expect(getAcceptOrdersResult).toMatchObject([
      {
        user_full_name: "Miss Chinny Kam",
        contact_num: 51170071,
        receiver_contact: 12345678,
        pick_up_date_time: "2023-03-01 11:03:00",
        pick_up_address: "203 15/F TML street 南區",
        deliver_address: "204 20/F TML street 南區",
        animals_name: ["貓", "狗"],
        animals_amount: [1, 1],
        remarks: "no remarks",
        orders_status: "訂單待接中",
      },
    ]);
  });

  test("get driver earns", async () => {
    const getDriverEarns = await driversMainService.getDriverEarns(orderIds[0]);
    const getDriverEarnsResult = getDriverEarns.rows;

    expect(getDriverEarnsResult).toMatchObject([
      {
        distance_km: 90,
        distance_total_price: 900,
        animals_name: ["貓", "狗"],
        animals_amount: [1, 1],
        animals_total_price: "80",
        total_price: "980",
        platform_fee: "196.0",
        driver_earns: "784.0",
      },
    ]);
  });

  test("confirm orders + update status to 司機已接單", async () => {
    await driversMainService.confirmAcceptOrder(driverID[0].id, orderIds[0]);

    const confirmAcceptOrderResult = await knex(orderTable)
      .select("orders_status")
      .where("orders_status", "=", "司機已接單")
      .andWhere("drivers_id", "=", driverID[0].id)
      .andWhere("orders.id", "=", orderIds[0]);

    expect(confirmAcceptOrderResult).toMatchObject([
      {
        orders_status: "司機已接單",
      },
    ]);
  });

  test("update status to 送貨中", async () => {
    await driversMainService.updateDriverDelivering(
      orderIds[1],
      driverID[0].id
    );

    const updateDriverDeliveringResult = await knex(orderTable)
      .select("orders_status")
      .where("orders_status", "=", "送貨中")
      .andWhere("orders.id", "=", orderIds[1])
      .andWhere("drivers_id", "=", driverID[0].id);

    expect(updateDriverDeliveringResult).toMatchObject([
      {
        orders_status: "送貨中",
      },
    ]);
  });

  test("get ongoing orders", async () => {
    const getOngoingOrders = await driversMainService.getOngoingOrders(
      driverID[0].id
    );
    const getOngoingOrdersResult = getOngoingOrders.rows;
    



    expect(getOngoingOrdersResult).toMatchObject([
      {
        id: orderIds[1],
        reference_code: "0753cde0-350c-4131-a276-13a30962acbf",
        user_full_name: "Miss Chinny Kam",
        contact_num: 51170071,
        pick_up_date_time: "2023-03-01 11:03:00",
        pick_up_address: "203 15/F TML street 南區",
        deliver_address: "204 20/F TML street 南區",
        animals_name: ["貓", "狗"],
        animals_amount: [1, 1],
        remarks: "no remarks",
        orders_status: "司機已接單",
      },
      {
        id: orderIds[2],
        reference_code: "0753cde0-350c-4131-a276-13a30962acbf",
        user_full_name: "Miss Chinny Kam",
        contact_num: 51170071,
        pick_up_date_time: "2023-03-01 11:03:00",
        pick_up_address: "203 15/F TML street 南區",
        deliver_address: "204 20/F TML street 南區",
        animals_name: ["貓", "狗"],
        animals_amount: [1, 1],
        remarks: "no remarks",
        orders_status: "送貨中",
      },
    ]);
  });

  test("get orders history", async () => {
    const getOrdersHistory = await driversMainService.getOrdersHistory(
      driverID[0].id
    );
    const getOrdersHistoryResult = getOrdersHistory.rows;

    expect(getOrdersHistoryResult).toMatchObject([
      {
        id: orderIds[3],
        reference_code: "6eac846d-763d-4552-8fbc-54464015d109",
        orders_status: "已完成",
        animals_name: ["貓", "狗"],
        animals_amount: [1, 1],
      },
    ]);
  });

  test("get single history", async () => {
    const getSingleHistory = await driversMainService.getSingleHistory(
      orderIds[3]
    );
    const getSingleHistoryResult = getSingleHistory.rows;

    expect(getSingleHistoryResult).toMatchObject([
      {
        id: orderIds[3],
        reference_code: "6eac846d-763d-4552-8fbc-54464015d109",
        orders_status: "已完成",
        pick_up_date_time: "2023-03-02 11:02:00",
        pick_up_address: "204 15/F TML street 南區",
        deliver_address: "205 20/F TML street 南區",
        animals_name: ["貓", "狗"],
        animals_amount: [1, 1],
        remarks: "hihihi",
      },
    ]);
  });

  afterEach(async () => {
    await knex(orderAnimalTable).del();
    await knex(orderTable).del();
  });

  afterAll(async () => {
    await knex(driverTable).del();
    await knex(userTable).del();
    await knex.destroy();
  });
});
