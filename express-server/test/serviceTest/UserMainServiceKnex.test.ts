import Knex from "knex";
import dotenv from "dotenv"
dotenv.config()

import config from "../../knexfile";
const knex = Knex(config[process.env.NODE_ENV || "development"]);
import { UsersMainService } from "../../services/UsersMainService";

describe("Test UsersMainServiceKnex", () => {
  let usersMainService = new UsersMainService(knex);
  let orderId: number;
  let usersId: number;
  let driversId: number;

  beforeAll(async () => {
    await knex("users").del();
    await knex("drivers").del();
    let returningUsersId = await knex("users")
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

    usersId = returningUsersId[0].id;
    // console.log("eeeeeee", usersId);

    let returningDriversId = await knex("drivers")
      .insert([
        {
          last_name: "Chow",
          first_name: "Yannes",
          title: "Miss",
          email: "yannes.0828@gmail.com",
          password: "a1234",
          contact_num: "51170071",
          car_license_num: "YC 1234",
          car_type: "Van",
        },
      ])
      .returning("id");

    driversId = returningDriversId[0].id;
    // console.log("eeeeeee", driversId);
  });
  beforeEach(async () => {
    let orderIds = await knex("orders")
      .insert([
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
          users_id: usersId,
          distance_km: 90,
          receiver_name: "Dad",
          receiver_contact: "12345678",
          token: "D11A11",
          remarks: "no remarks",
          orders_status: "not pay yet",
        },
      ])
      .returning("id");

    orderId = orderIds[0].id;

    // console.log("insert order's id", orderId);

    let animals_id = ["1", "2"];
    let animals_amount = ["1", "1"];

    for (let i = 0; i < animals_id.length; i++) {
      const animals_history_price = await knex("animals")
        .select("price")
        .where("id", "=", `${parseInt(animals_id[i])}`)
        .first();

      // console.log("anm!!!!", animals_history_price);
      // console.log("order id", orderId);
      // const orderAnimal = await knex("order_animals").insert({
      await knex("order_animals").insert({
        orders_id: orderId,
        animals_id: parseInt(animals_id[i]),
        animals_amount: parseInt(animals_amount[i]),
        animals_history_price: animals_history_price.price,
      });
      // console.log(orderAnimal);
    }
  });

  it("get userInfo", async () => {
    const getUserInfo = await usersMainService.getUserInfo(usersId);

    // console.log("check cehck", getUserInfo);
    expect(getUserInfo).toMatchObject({
      first_name: "Chinny",
    });
  });

  it("get Address", async () => {
    const getAddress = await usersMainService.getAddress(usersId);
    // console.log("address", getAddress);

    expect(getAddress).toMatchObject({
      default_district: "Central and Western",
      default_room: "Room 209",
      default_floor: "2/F",
      default_building: "Pacific Place",
      default_street: "88 Queensway",
    });
  });

  it("createOrder", async () => {
    let input = {
      pick_up_date: "2023-03-29",
      pick_up_time: "10:00",
      pick_up_district: "東區",
      pick_up_room: "Room 109",
      pick_up_floor: "1/F",
      pick_up_building: "Cityplaza",
      pick_up_street: "18 Tai Koo Shing Rd",
      deliver_district: "灣仔區",
      deliver_room: "Room 210",
      deliver_floor: "2/F",
      deliver_building: "Times Square",
      deliver_street: "1 Matheson St",
      users_id: usersId,
      distance_km: 40,
      receiver_name: "Dad",
      receiver_contact: 51170071,
      token: "SD1234",
      remarks: "good luck",
      animals_id: ["1", "2"],
      animals_amount: ["1", "1"],
    };

    const createOrder = await usersMainService.createOrder(input);
    // console.log("createOrder id~~~~~~~~~~", createOrder);

    const order = await knex("orders")
      .select(
        knex.raw(` CONCAT(pick_up_date,' ',pick_up_time) AS pick_up_date_time,
        CONCAT(pick_up_room,' ',pick_up_floor,' ',pick_up_building,' ',pick_up_street,' ',pick_up_district) AS pick_up_address,
        CONCAT(deliver_room,' ',deliver_floor,' ',deliver_building,' ',deliver_street,' ',deliver_district) AS deliver_address,
        users_id,
        json_agg(animals.animals_name) AS animals_name,
        json_agg(order_animals.animals_amount) AS animals_amount,
        max(distance_km) AS distance_km,
        receiver_name,
        receiver_contact,
        token,
        remarks`)
      )
      .join("order_animals", "order_animals.orders_id", "orders.id")
      .join("animals", "animals.id", "order_animals.animals_id")
      .where("orders.id", createOrder[0].id)
      .groupBy(
        "distance_km",
        "pick_up_date_time",
        "pick_up_address",
        "deliver_address",
        "users_id",
        "receiver_name",
        "receiver_contact",
        "token",
        "remarks"
      );

    expect(order).toMatchObject([
      {
        pick_up_date_time: "2023-03-29 10:00:00",
        pick_up_address: "Room 109 1/F Cityplaza 18 Tai Koo Shing Rd 東區",
        deliver_address: "Room 210 2/F Times Square 1 Matheson St 灣仔區",
        users_id: usersId,
        animals_name: ["貓", "狗"],
        animals_amount: [1, 1],
        distance_km: 40,
        receiver_name: "Dad",
        receiver_contact: 51170071,
        token: "SD1234",
        remarks: "good luck",
      },
    ]);
  });

  it("payOrderDetails", async () => {
    const payOrderDetails = await usersMainService.payOrderDetails(usersId);

    expect(payOrderDetails).toMatchObject({
      pick_up_date_time: "2023-10-01 12:00:00",
      pick_up_address: "303 18/F TML street 西區",
      deliver_address: "204 20/F TML street 西區",
      animals_name: ["貓", "狗"],
      animals_amount: [1, 1],
      remarks: "no remarks",
      distance_km: 90,
      id: orderId,
      distance_total_price: 900,
      animals_total_price: "80",
      total_price: "980",
    });
  });

  it("confirm order which is not pay yet ", async () => {
    await usersMainService.confirmOrder(usersId, orderId);

    // console.log("testing!!!!!", orderId);
    const confirmOrderResult = await knex("orders")
      .select("orders_status")
      .where("id", orderId)
      .andWhere("users_id", usersId);

    expect(confirmOrderResult).toMatchObject([{ orders_status: "訂單待接中" }]);
  });

  it("show orders that paid and not complete", async () => {
    //轉status for select
    await knex("orders").where("id", "=", orderId).update({
      orders_status: "訂單待接中",
      created_at: "2023-05-09 14:39:56",
      reference_code: "f686c2a9-233d-4b90-978f-6fa28973d43b",
    });

    const orderStatus = await usersMainService.orderStatus(usersId);

    expect(orderStatus).toMatchObject([
      {
        id: orderId,
        created_at: "2023-05-09 14:39:56",
        pick_up_address: "303 18/F TML street 西區",
        deliver_address: "204 20/F TML street 西區",
        pick_up_date_time: "2023-10-01 12:00:00",
        animals_name: ["貓", "狗"],
        animals_amount: [1, 1],
        remarks: "no remarks",
        orders_status: "訂單待接中",
        reference_code: "f686c2a9-233d-4b90-978f-6fa28973d43b",
        drivers_id: null,
      },
    ]);
  });

  it("show details of orders not finish", async () => {
    await knex("orders").where("id", "=", orderId).update({
      orders_status: "司機已接單",
      created_at: "2023-05-09 14:39:56",
      reference_code: "f686c2a9-233d-4b90-978f-6fa28973d43b",
      drivers_id: driversId,
    });

    const orderStatusDetails = await usersMainService.orderStatusDetails(
      usersId,
      orderId
    );
    console.log("orderStatusDetails: ", orderStatusDetails);

    expect(orderStatusDetails).toMatchObject({
      full_name: "Miss Yannes Chow",
      contact_num: 51170071,
      car_license_num: "YC 1234",
    });
  });

  it("show orders that completed", async () => {
    //轉status for select
    await knex("orders").where("id", "=", orderId).update({
      orders_status: "已完成",
      created_at: "2023-05-09 14:39:56",
      reference_code: "f686c2a9-233d-4b90-978f-6fa28973d43b",
      drivers_id: driversId,
    });

    const historyOrders = await usersMainService.historyOrders(usersId);

    expect(historyOrders).toMatchObject([
      {
        id: orderId,
        reference_code: "f686c2a9-233d-4b90-978f-6fa28973d43b",
        orders_status: "已完成",
        animals_name: ["貓", "狗"],
        animals_amount: [1, 1],
      },
    ]);
  });

  it("show details of orders not finish", async () => {
    await knex("orders").where("id", "=", orderId).update({
      orders_status: "已完成",
      created_at: "2023-05-09 14:39:56",
      reference_code: "f686c2a9-233d-4b90-978f-6fa28973d43b",
      drivers_id: driversId,
    });

    const historyOrderDetails = await usersMainService.historyOrderDetails(
      usersId,
      orderId
    );

    expect(historyOrderDetails).toMatchObject({
      id: orderId,
      reference_code: "f686c2a9-233d-4b90-978f-6fa28973d43b",
      created_at: "2023-05-09 14:39:56",
      orders_status: "已完成",
      pick_up_address: "303 18/F TML street 西區",
      deliver_address: "204 20/F TML street 西區",
      pick_up_date_time: "2023-10-01 12:00:00",
      animals_name: ["貓", "狗"],
      animals_amount: [1, 1],
      remarks: "no remarks",
    });
  });

  afterEach(async () => {
    await knex("order_animals").del();
    await knex("orders").del();
  });

  afterAll(async () => {
    await knex("order_animals").del();
    await knex("orders").del();
    await knex("users").del();
    await knex.destroy();
  });
});
