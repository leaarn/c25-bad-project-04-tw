import Knex from "knex";
import dotenv from "dotenv";
dotenv.config();


import config from "../../knexfile";
const knex = Knex(config[process.env.NODE_ENV || "development"]);
// import { hashPassword } from "../../utils/hash";

import { ReceiversService } from "../../services/ReceiversService";

describe("Test Check Token", () => {
  let receiversService: ReceiversService;

  beforeEach(async () => {
    receiversService = new ReceiversService(knex);
    await knex("orders").insert({ token: "abc123" });
  });

  it("check token", async () => {
    await receiversService.checkToken("abc123");

    const token = await knex("orders")
      .select("id", "token")
      .where("token", "=", "abc123");

    expect(token).toMatchObject([
      {
        token: "abc123",
      },
    ]);
  });

  it("change status", async () => {
    await receiversService.checkToken("abc123");

    await knex("orders")
      .select("id", "token")
      .where("token", "=", "abc123")
      .update("orders_status", "已完成");

    const result = await knex("orders")
      .where("token", "=", "abc123")
      .select("orders_status");

    expect(result).toMatchObject([
      {
        orders_status: "已完成",
      },
    ]);
  });

  afterEach(async () => {
    // Removed inserted data to keep testing database clean
    await knex("order_animals").del();
    await knex("orders").del();
  });

  afterAll(async () => {
    await knex.destroy();
  });
});
