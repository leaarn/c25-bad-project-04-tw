import Knex from "knex";
const knexfile = require("../knexfile");
const knex = Knex(knexfile["test2"]);

import {UsersService} from "../../services/UsersService";

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
      email:"abc@gmail.com",
      password:"123abc"
      contactNum:"123",
      defaultDistrict:"",
      defaultRoom,
      defaultFloor,
      defaultBuilding,
      defaultStreet,
    };
    //  await usersService.createAccount(input);

      const userId = await this.knex("users")
        .insert({
          last_name: input.lastName,
          first_name: input.firstName,
          title: input.title,
          email: input.email,
          password: hashedPassword,
          contact_num: input.contactNum,
          default_district: input.defaultDistrict,
          default_room: input.defaultRoom,
          default_floor: input.defaultFloor,
          default_building: input.defaultBuilding,
          default_street: input.defaultStreet,
        })
        .returning("id");

});

});
