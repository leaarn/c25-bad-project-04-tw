import { driversLogin } from "../model";
import { createDrivers } from "../model";
import { checkPassword, hashPassword } from "../utils/hash";
import type { Knex } from "knex";

export class DriversService {
  constructor(private knex: Knex) {}

  login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error("missing username or password");
    }
    const foundDriver = await this.knex<driversLogin>("drivers")
      .select("id", "first_name", "email", "password")
      .where("email", email)
      .first();

    if (!foundDriver) {
      throw new Error("invalid username ");
    }

    if (!(await checkPassword(password, foundDriver.password))) {
      throw new Error("invalid password ");
    }
    return foundDriver;
  };

  createAccount = async (input: createDrivers) => {
    const result = await this.knex<createDrivers>("drivers")
      .select("id", "email")
      .where("email", input.email)
      .first();

    if (result) {
      throw new Error("existing users!");
    }

    const hashedPassword = await hashPassword(input.password);
    const driverId = await this.knex("drivers")
      .insert({
        last_name: input.lastName,
        first_name: input.firstName,
        title: input.title,
        email: input.email,
        password: hashedPassword,
        contact_num: input.contactNum,
        car_license_num: input.carLicenseNum,
        car_type: input.carType,
      })
      .returning("id");

    return driverId;
  };
}
