import type { Knex } from "knex";
import { userTable, orderTable } from "../migrations/20230503035349_init-db";
import { sendMessage, getTextMessageInput } from "../routers/messageHelper";

export class DriversMainService {
  constructor(private knex: Knex) {}

  getDriverInfo = async (driverID: number) => {
    const getDriverNameResult = await this.knex(userTable)
      .select("first_name")
      .where("id", driverID)
      .first();
    return getDriverNameResult;
  };

  getDistricts = async () => {
    const getDistrictsResult = await this.knex(orderTable)
      .select("pick_up_district", "deliver_district")
      .where("orders_status", "=", "訂單待接中");
    return getDistrictsResult;
  };

  getAllOrders = async () => {
    const getAllOrdersResult = await this.knex
      .raw(/*sql*/ `SELECT orders.id, pick_up_district, deliver_district, pick_up_date, pick_up_time, 
      json_agg(animals.animals_name) AS animals_name, 
      json_agg(order_animals.animals_amount) AS animals_amount, 
      orders_status 
      FROM orders 
      JOIN order_animals ON order_animals.orders_id = orders.id 
      JOIN animals ON animals.id = order_animals.animals_id WHERE orders.orders_status = '訂單待接中'
      GROUP BY orders.id, pick_up_district, deliver_district, pick_up_date, pick_up_time, orders_status ORDER BY pick_up_date DESC`);
    return getAllOrdersResult;
  };

  getAcceptOrders = async (orderId: number) => {
    const getAcceptOrdersResult = await this.knex.raw(/*sql*/ `SELECT orders.id,
    CONCAT(users.title, ' ', users.first_name, ' ', users.last_name) AS user_full_name, 
    users.contact_num, 
    receiver_contact,
    CONCAT(pick_up_date, ' ', pick_up_time) AS pick_up_date_time, 
    CONCAT(pick_up_room, ' ', pick_up_floor, ' ', pick_up_building, ' ', pick_up_street, ' ', pick_up_district) AS pick_up_address, 
    CONCAT(deliver_room, ' ', deliver_floor, ' ', deliver_building, ' ', deliver_street, ' ', deliver_district) AS deliver_address, 
    json_agg(animals.animals_name) AS animals_name, 
    json_agg(order_animals.animals_amount) AS animals_amount, 
    remarks, orders_status 
    FROM orders 
    JOIN users ON orders.users_id = users.id
    JOIN order_animals ON order_animals.orders_id = orders.id 
    JOIN animals ON animals.id = order_animals.animals_id
    WHERE orders_status = '訂單待接中' AND orders.id = ${orderId}
    GROUP BY orders.id, user_full_name, receiver_contact, contact_num, pick_up_date_time, pick_up_address, deliver_address, remarks, orders_status
    `);
    return getAcceptOrdersResult;
  };

  getDriverEarns = async (orderId: number) => {
    const driverEarnsResult = await this.knex.raw(/*sql*/ `SELECT distance_km, 
    max(distance_km * distance_price) AS distance_total_price, 
    json_agg(animals.animals_name) AS animals_name,
    json_agg(order_animals.animals_amount) AS animals_amount,
    SUM(order_animals.animals_history_price * order_animals.animals_amount) AS animals_total_price, 
    max(distance_km * distance_price) + SUM(order_animals.animals_history_price * order_animals.animals_amount) AS total_price,
    (max(distance_km * distance_price) + SUM(order_animals.animals_history_price * order_animals.animals_amount)) * 0.2 AS platform_fee,
    max(distance_km * distance_price) + SUM(order_animals.animals_history_price * order_animals.animals_amount) - ((max(distance_km * distance_price) + SUM(order_animals.animals_history_price * order_animals.animals_amount)) * 0.2) AS driver_earns
    FROM orders 
    JOIN users ON orders.users_id = users.id
    JOIN order_animals ON order_animals.orders_id = orders.id 
    JOIN animals ON animals.id = order_animals.animals_id
    WHERE orders_status = '訂單待接中' AND orders.id = ${orderId}
    GROUP BY distance_km`);
    return driverEarnsResult;
  };

  getOrdersHistory = async (driverID: number) => {
    const getAllHistoryResult = await this.knex
      .raw(/*sql*/ `SELECT orders.id, reference_code, orders_status, 
    json_agg(animals.animals_name) AS animals_name, 
    json_agg(order_animals.animals_amount) AS animals_amount 
    FROM orders 
    JOIN order_animals ON order_animals.orders_id = orders.id 
    JOIN animals ON animals.id = order_animals.animals_id 
    WHERE orders.orders_status = '已完成' AND orders.drivers_id = ${driverID}
    GROUP BY orders.id, reference_code, orders_status`);
    return getAllHistoryResult;
  };

  getSingleHistory = async (orderId: number) => {
    const getSingleQuery = await this.knex
      .raw(/*sql*/ `SELECT orders.id, reference_code, orders_status, 
        CONCAT(pick_up_date, ' ', pick_up_time) AS pick_up_date_time,CONCAT(pick_up_room, ' ', pick_up_floor, ' ', pick_up_building, ' ', pick_up_street, ' ', pick_up_district) AS pick_up_address,
        CONCAT(deliver_room, ' ', deliver_floor, ' ', deliver_building, ' ', deliver_street, ' ', deliver_district) AS deliver_address, 
        json_agg(animals.animals_name) AS animals_name, 
        json_agg(order_animals.animals_amount) AS animals_amount,
        remarks
        FROM orders 
        JOIN order_animals ON order_animals.orders_id = orders.id 
        JOIN animals ON animals.id = order_animals.animals_id 
        WHERE orders.orders_status = '已完成' AND orders_id = ${orderId}
        GROUP BY orders.id, pick_up_date_time, pick_up_address, deliver_address, remarks, orders_status`);
    return getSingleQuery;
  };

  getOngoingOrders = async (driverID: number) => {
    const getOngoingOrdersResult = await this.knex
      .raw(/*sql*/ `SELECT orders.id, reference_code, 
    CONCAT(users.title, ' ', users.first_name, ' ', users.last_name) AS user_full_name, 
    users.contact_num, 
    CONCAT(pick_up_date, ' ', pick_up_time) AS pick_up_date_time, 
    CONCAT(pick_up_room, ' ', pick_up_floor, ' ', pick_up_building, ' ', pick_up_street, ' ', pick_up_district) AS pick_up_address, 
    CONCAT(deliver_room, ' ', deliver_floor, ' ', deliver_building, ' ', deliver_street, ' ', deliver_district) AS deliver_address, 
    json_agg(animals.animals_name) AS animals_name, 
    json_agg(order_animals.animals_amount) AS animals_amount, 
    remarks, orders_status
    FROM orders 
    JOIN users ON orders.users_id = users.id
    JOIN order_animals ON order_animals.orders_id = orders.id 
    JOIN animals ON animals.id = order_animals.animals_id
    WHERE (orders.orders_status = '司機已接單' OR orders.orders_status = '送貨中') AND drivers_id = ${driverID}
    GROUP BY orders.id, reference_code, user_full_name, contact_num, pick_up_date_time, pick_up_address, deliver_address, remarks, orders_status
    ORDER BY orders_status ASC`);
    return getOngoingOrdersResult;
  };

  getDriverDelivering = async (orderId: number, driverID: number) => {
    const driverDeliveringResult = await this.knex
      .raw(/*sql*/ `UPDATE orders SET orders_status = '送貨中'
    WHERE (orders_status = '司機已接單' AND orders.id = ${orderId} AND drivers_id = ${driverID})
    `);
    return driverDeliveringResult;
  };

  confirmAcceptOrder = async (driverID: number, orderId: number) => {
    const confirmAcceptOrderResult = await this.knex
      .raw(/*sql*/ `UPDATE orders SET orders_status = '司機已接單', drivers_id = ${driverID}
    WHERE orders_status = '訂單待接中' AND orders.id = ${orderId} 
    `);
    return confirmAcceptOrderResult;
  };

  message = async (orderId: number) => {
    const contact = await this.knex.raw(
      /*SQL*/ `SELECT receiver_contact FROM orders WHERE orders.id = ${orderId} `
    );
    const name = await this.knex.raw(
      /*SQL*/ `SELECT receiver_name FROM orders WHERE orders.id = ${orderId} `
    );
    const tokenResult = await this.knex.raw(
      /*SQL*/ `SELECT token FROM orders WHERE orders.id = ${orderId} `
    );

    const data = getTextMessageInput(
      "852" + contact[0].receiver_contact.toString(),
      `Hi ${name[0].receiver_name}! Here is your receiver token: ${tokenResult[0].token}. Click the link http://localhost:8080/receivers.html to input your verification code. Have a great day!`
    );
    const resp = await sendMessage(data);
    return resp;
  };
}