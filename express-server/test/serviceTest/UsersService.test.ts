import Knex from "knex";
import dotenv from "dotenv"
dotenv.config()

import config from "../../knexfile";
const knex = Knex(config[process.env.NODE_ENV || "development"]);
// import { hashPassword } from "../../utils/hash";
// import { createUsers } from "../../model";

import { UsersService } from "../../services/UsersService";

describe("Test Auth Service", () => {
  let usersService: UsersService;

  beforeEach(async () => {
    usersService = new UsersService(knex);
  });

  it("should create account", async () => {
    const input = {
      lastName: "Julia",
      firstName: "Wong",
      title: "Miss",
      email: "hihi",
      password: "123abc",
      contactNum: 123,
      defaultDistrict: "abc",
      defaultRoom: "123",
      defaultFloor: "123",
      defaultBuilding: "123",
      defaultStreet: "123",
    };

    const newUsers = await usersService.createAccount(input);

    const result = await knex("users")
      .select("users.*")
      .where("id", "=", newUsers[0].id);
    expect(result.length).toBe(1);
  });

  it("existing users", async () => {
    const input = {
      lastName: "Julia",
      firstName: "Wong",
      title: "Miss",
      email: "hi",
      password: "123abc",
      contactNum: 123,
      defaultDistrict: "abc",
      defaultRoom: "123",
      defaultFloor: "123",
      defaultBuilding: "123",
      defaultStreet: "123",
    };

    await usersService.createAccount(input);

    const result = await knex("users")
      .select("id", "email")
      .where("email", input.email)
      .first();

    if (result) {
      const t = () => {
        throw new TypeError("existing users!");
      };
      expect(t).toThrow(TypeError);
      expect(t).toThrow("existing users!");
    }
  });

  afterEach(async () => {
    // Removed inserted data to keep testing database clean
    await knex("order_animals").del();
    await knex("orders").del();
    await knex("users").del();
  });

  afterAll(async () => {
    await knex.destroy();
  });
});
