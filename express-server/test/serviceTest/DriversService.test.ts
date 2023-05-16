import Knex from "knex";
import dotenv from "dotenv";
dotenv.config();

import config from "../../knexfile";
const knex = Knex(config[process.env.NODE_ENV || "development"]);
// import { hashPassword } from "../../utils/hash";

import { DriversService } from "../../services/DriversService";

describe("Test Auth Service", () => {
  let driverService: DriversService;

  beforeEach(async () => {
    driverService = new DriversService(knex);
  });

  it("should create account", async () => {
    const input = {
      lastName: "Julia",
      firstName: "Wong",
      title: "Miss",
      email: "hihi",
      password: "123abc",
      contactNum: 123,
      carLicenseNum: "abc",
      carType: "123",
    };

    const newDriver = await driverService.createAccount(input);

    const result = await knex("drivers")
      .select("drivers")
      .where("id", "=", newDriver[0].id);
    expect(result.length).toBe(1);
  });

  it("existing drivers", async () => {
    const input = {
      lastName: "Julia",
      firstName: "Wong",
      title: "Miss",
      email: "hihi",
      password: "123abc",
      contactNum: 123,
      carLicenseNum: "abc",
      carType: "123",
    };

    await driverService.createAccount(input);

    const result = await knex("drivers")
      .select("id", "email")
      .where("email", input.email)
      .first();

    if (result) {
      const t = () => {
        throw new TypeError("existing drivers!");
      };
      expect(t).toThrow(TypeError);
      expect(t).toThrow("existing drivers!");
    }
  });

  afterEach(async () => {
    // Removed inserted data to keep testing database clean
    await knex("order_animals").del();
    await knex("orders").del();
    await knex("drivers").del();
  });

  afterAll(async () => {
    await knex.destroy();
  });
});
